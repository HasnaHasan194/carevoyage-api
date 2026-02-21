import { inject, injectable } from "tsyringe";
import { IEnableSpecialNeedUsecase } from "../../interfaces/agency-special-needs/enable-special-need.interface";
import { EnableSpecialNeedRequestDTO } from "../../../dto/request/enable-special-need-request.dto";
import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMapper } from "../../../mapper/agency-special-needs.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class EnableSpecialNeedUsecase implements IEnableSpecialNeedUsecase {
  constructor(
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    agencyId: string,
    data: EnableSpecialNeedRequestDTO
  ): Promise<AgencySpecialNeedsResponseDTO> {
    // Check if special need exists in agency's master list
    const specialNeedMaster =
      await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
        data.specialNeedId,
        agencyId
      );
    if (!specialNeedMaster) {
      throw new NotFoundError("Special need not found");
    }

    if (specialNeedMaster.isDeleted) {
      throw new ValidationError("This special need is not available");
    }

    // Check if already exists (including soft-deleted)
    const existing = await this._agencySpecialNeedsRepository.findByAgencyIdAndSpecialNeedId(
      agencyId,
      data.specialNeedId
    );

    if (existing) {
      if (existing.isDeleted) {
        // Restore and update - use updateById instead of save to avoid duplicate key error
        const restored = await this._agencySpecialNeedsRepository.updateById(
          existing._id,
          {
            unit: data.unit,
            price: data.price,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
          }
        );

        if (!restored) {
          throw new NotFoundError("Special need configuration not found");
        }
        const master = await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
          restored.specialNeedId,
          agencyId
        );
        if (!master) {
          return AgencySpecialNeedsMapper.toResponseDto(restored);
        }
        return AgencySpecialNeedsMapper.toResponseDto(restored, {
          id: master._id,
          name: master.name,
          shortCode: undefined,
          description: master.description,
        });
      } else {
        throw new ValidationError(
          "This special need is already configured for your agency"
        );
      }
    }

    // Create new configuration
    const agencySpecialNeed = await this._agencySpecialNeedsRepository.save({
      agencyId,
      specialNeedId: data.specialNeedId,
      unit: data.unit,
      price: data.price,
      isActive: true,
      isDeleted: false,
    });

    return AgencySpecialNeedsMapper.toResponseDto(
      agencySpecialNeed,
      {
        id: specialNeedMaster._id.toString(),
        name: specialNeedMaster.name,
        shortCode: undefined,
        description: specialNeedMaster.description,
      }
    );
  }
}
