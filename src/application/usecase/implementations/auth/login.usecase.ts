import { inject, injectable } from "tsyringe";
import { ILoginUsecase } from "../../interfaces/auth/loginUsecase.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";

import { BaseLoginRequest } from "../../../dto/request/base-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import {
  ERROR_MESSAGE,
} from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { UserMapper } from "../../../mapper/user.mapper";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";


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

    // Verify role is "client" (role-based security check)
    if (isEmailExist.role !== "client") {
      throw new ValidationError("Invalid account type. This is not a client account.");
    }

    // Check if user is blocked
    if (isEmailExist.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }

    // Verify password
    const isPasswordMatch = await comparePassword(
       data.password,
       isEmailExist.password
    );

    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    return UserMapper.mapToLoginResponseDto(isEmailExist);
  }
}
                                                                             