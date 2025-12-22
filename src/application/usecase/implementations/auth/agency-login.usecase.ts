import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { AgencyLoginRequestDTO } from "../../../dto/request/agencylogin-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { AgencyMapper } from "../../../mapper/agency.mapper";

@injectable()
export class AgencyLoginUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(data: AgencyLoginRequestDTO): Promise<LoginResponseDTO> {
   

    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    if (user.role !== "agency_owner") {
      throw new ValidationError("Not an agency account");
    }

    if (user.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }

    const isPasswordMatch = comparePassword(user.password, data.password);

    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    const agency = await this._agencyRepository.findByUserId(user._id);

    if (!agency) {
      throw new NotFoundError("Agency profile not found");
    }

    if (agency.isBlocked) {
      throw new ValidationError("Agency account is blocked");
    }

    // if (agency.verificationStatus !== "verified") {
    //   throw new ValidationError(
    //     "Agency account is not verified yet"
    //   );
    // }

    return AgencyMapper.mapToLoginResponseDto(user);
  }
}
