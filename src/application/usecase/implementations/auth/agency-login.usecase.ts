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
    // Type assertion to AgencyLoginRequestDTO for internal validation if needed
    const agencyLoginData = data as AgencyLoginRequestDTO;
   

    const user = await this._userRepository.findByEmail(agencyLoginData.email);

    console.log(user,"-->user")



    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    if (user.role !== "agency_owner") {
      throw new ValidationError("Not an agency account");
    }

    if (user.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }

    const isPasswordMatch = comparePassword(user.password, agencyLoginData.password);

    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    const agency = await this._agencyRepository.findByUserId(user._id);

    console.log(agency)

    if (!agency) {
      throw new NotFoundError("Agency profile not found");
    }

    if (agency.isBlocked) {
      throw new ValidationError("Agency account is blocked");
    }

  
    return AgencyMapper.mapToLoginResponseDto(user);
  }
}
