import { inject, injectable } from "tsyringe";
import { IToggleActiveStatusUsecase } from "../../interfaces/agency-special-needs/toggle-active-status.interface";
import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMapper } from "../../../mapper/agency-special-needs.mapper";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class ToggleActiveStatusUsecase implements IToggleActiveStatusUsecase {
  constructor(
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    id: string,
    agencyId: string,
    isActive: boolean
  ): Promise<AgencySpecialNeedsResponseDTO> {
    // Check if exists and belongs to agency
    const existing = await this._agencySpecialNeedsRepository.findByIdAndAgencyId(
      id,
      agencyId
    );

    if (!existing) {
      throw new NotFoundError("Special need configuration not found");
    }

    if (existing.isDeleted) {
      throw new NotFoundError("Cannot toggle status of a deleted special need configuration");
    }

    // Update isActive status - use updateById instead of save to avoid duplicate key error
    const updated = await this._agencySpecialNeedsRepository.updateById(
      existing._id,
      {
        isActive,
      }
    );

    if (!updated) {
      throw new NotFoundError("Special need configuration not found");
    }

    // Get master details
    const master = await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
      updated.specialNeedId,
      agencyId
    );

    if (!master) {
      return AgencySpecialNeedsMapper.toResponseDto(updated);
    }

    return AgencySpecialNeedsMapper.toResponseDto(updated, {
      id: master._id,
      name: master.name,
      shortCode: undefined,
      description: master.description,
    });
  }
}
