import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { AgencyProfileResponseDTO } from "../../../dto/response/agency-profile-response.dto";
import { UpdateAgencyProfileRequestDTO } from "../../../dto/request/update-agency-profile-request.dto";
import { IUpdateAgencyProfileUsecase } from "../../interfaces/agency/update-agency-profile.interface";
import { IGetAgencyProfileUsecase } from "../../interfaces/agency/get-agency-profile.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class UpdateAgencyProfileUsecase implements IUpdateAgencyProfileUsecase {
  constructor(
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IGetAgencyProfileUsecase")
    private readonly _getAgencyProfileUsecase: IGetAgencyProfileUsecase
  ) {}

  async execute(
    userId: string,
    data: UpdateAgencyProfileRequestDTO
  ): Promise<AgencyProfileResponseDTO> {
    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND_FOR_USER);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    if (data.phone !== undefined) {
      const trimmedPhone = (data.phone ?? "").toString().trim();
      if (trimmedPhone && trimmedPhone !== user.phone) {
        const phoneExists = await this._userRepository.findByPhone(trimmedPhone);
        if (phoneExists && phoneExists._id !== userId) {
          throw new ValidationError(ERROR_MESSAGE.USER.PHONE_ALREADY_IN_USE);
        }
      }
    }

    const userUpdateData: Record<string, unknown> = {};
    if (data.phone !== undefined) {
      userUpdateData.phone = (data.phone ?? "").toString().trim() || null;
    }
    if (data.profileImage !== undefined) {
      userUpdateData.profileImage = data.profileImage || null;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await this._userRepository.updateById(userId, userUpdateData);
    }

    const agencyUpdateData: Record<string, unknown> = {};
    if (data.agencyName !== undefined) {
      agencyUpdateData.agencyName = data.agencyName.trim();
    }
    if (data.address !== undefined) {
      agencyUpdateData.address = data.address.trim();
    }
    if (data.description !== undefined) {
      agencyUpdateData.description = data.description.trim() || null;
    }

    if (Object.keys(agencyUpdateData).length > 0) {
      await this._agencyRepository.updateById(agency._id, agencyUpdateData);
    }

    return this._getAgencyProfileUsecase.execute(userId);
  }
}
