import { inject, injectable } from "tsyringe";
import { ILoginUsecase } from "../../interfaces/auth/loginUsecase.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { AgencyLoginRequestDTO } from "../../../dto/request/agencylogin-request.dto";
import { BaseLoginRequest } from "../../../dto/request/base-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { AgencyMapper } from "../../../mapper/agency.mapper";

@injectable()
export class AgencyLoginUsecase implements ILoginUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(data: BaseLoginRequest): Promise<LoginResponseDTO> {
    const agencyLoginData = data as AgencyLoginRequestDTO;
   

    const user = await this._userRepository.findByEmail(agencyLoginData.email);

    console.log(user,"-->user")



    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    if (user.role !== "agency_owner") {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_ACCOUNT_TYPE_NOT_AGENCY);
    }

    if (user.isBlocked) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.USER_BLOCKED);
    }

    const isPasswordMatch = await comparePassword(agencyLoginData.password,user.password,);

    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    const agency = await this._agencyRepository.findByUserId(user._id);

    console.log(agency)

    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.PROFILE_NOT_FOUND);
    }

    if (agency.isBlocked) {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.ACCOUNT_BLOCKED);
    }

  
    return AgencyMapper.mapToLoginResponseDto(user);//=>controller
  }
}
