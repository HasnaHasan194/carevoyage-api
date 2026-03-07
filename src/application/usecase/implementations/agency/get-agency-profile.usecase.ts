import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { AgencyProfileResponseDTO } from "../../../dto/response/agency-profile-response.dto";
import { IGetAgencyProfileUsecase } from "../../interfaces/agency/get-agency-profile.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetAgencyProfileUsecase implements IGetAgencyProfileUsecase {
  constructor(
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<AgencyProfileResponseDTO> {
    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND_FOR_USER);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    return {
      id: agency._id,
      userId: agency.userId,
      agencyName: agency.agencyName,
      email: user.email,
      phone: user.phone ?? null,
      registrationNumber: agency.registrationNumber,
      address: agency.address,
      profileImage: user.profileImage ?? null,
      description: agency.description ?? undefined,
      verificationStatus: agency.verificationStatus,
      isBlocked: agency.isBlocked,
      createdAt: agency.createdAt,
      updatedAt: agency.updatedAt,
    };
  }
}
