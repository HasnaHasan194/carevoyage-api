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

    let agency = await this._agencyRepository.findByUserId(user._id);

    if (!agency) {
      // Double-check: try finding by registration number to avoid duplicates
      const existingByReg = await this._agencyRepository.findByRegistrationNumber(`PENDING-${user._id}`);
      if (!existingByReg) {
        agency = await this._agencyRepository.save({
          userId: user._id,
          agencyName: "Complete your profile",
          address: "To be updated",
          registrationNumber: `PENDING-${user._id}`,
          description: undefined,
          verificationStatus: "pending",
          isBlocked: false,
        });
      } else {
        agency = existingByReg;
      }
    }

    if (agency.isBlocked) {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.ACCOUNT_BLOCKED);
    }

    if (agency.verificationStatus === "rejected") {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.REGISTRATION_REJECTED);
    }

    if (agency.verificationStatus !== "verified" && agency.verificationStatus !== "pending") {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.REGISTRATION_PENDING);
    }

    return AgencyMapper.mapToLoginResponseDto(user);//=>controller
  }
}
