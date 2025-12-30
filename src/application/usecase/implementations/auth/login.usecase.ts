import { inject, injectable } from "tsyringe";
import { ILoginUsecase } from "../../interfaces/auth/loginUsecase.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { LoginRequestDTO } from "../../../dto/request/login-request.dto";
import { BaseLoginRequest } from "../../../dto/request/base-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import {
  ERROR_MESSAGE,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants/constants";
import { comparePassword, hashPassword } from "../../../../shared/utils/bcryptHelper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { UserMapper } from "../../../mapper/user.mapper";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";
import { mailContentProvider } from "../../../../shared/mailContentProvider";

@injectable()
export class LoginUsecase implements ILoginUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(data: BaseLoginRequest): Promise<LoginResponseDTO> {

    const isEmailExist = await this._userRepository.findByEmail(data.email);
   
    if (!isEmailExist) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    const isPasswordMatch = await comparePassword(
       data.password,
       isEmailExist.password
    );

 
    // console.log(data.password,"-------->userpassword")
    // console.log(isEmailExist.password,"-------->dbpassword")

    //  console.log(isPasswordMatch,"----->password")
    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    if (isEmailExist.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }


    return UserMapper.mapToLoginResponseDto(isEmailExist);
  }
}
                                                                             