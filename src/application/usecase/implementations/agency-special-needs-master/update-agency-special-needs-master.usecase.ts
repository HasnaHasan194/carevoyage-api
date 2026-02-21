import { inject, injectable } from "tsyringe";
import { IUpdateAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/update-agency-special-needs-master.interface";
import { UpdateAgencySpecialNeedsMasterRequestDTO } from "../../../dto/request/update-agency-special-needs-master-request.dto";
import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMasterMapper } from "../../../mapper/agency-special-needs-master.mapper";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class UpdateAgencySpecialNeedsMasterUsecase
  implements IUpdateAgencySpecialNeedsMasterUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    id: string,
    agencyId: string,
    data: UpdateAgencySpecialNeedsMasterRequestDTO
  ): Promise<AgencySpecialNeedsMasterResponseDTO> {
    // Check if exists and belongs to agency
    const existing = await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
      id,
      agencyId
    );

    if (!existing) {
      throw new NotFoundError("Special need not found");
    }

    if (existing.isDeleted) {
      throw new NotFoundError("Cannot update a deleted special need");
    }

    // If name is being updated, check for duplicates
    if (data.name && data.name.trim() !== existing.name) {
      const duplicate = await this._agencySpecialNeedsMasterRepository.findByNameAndAgencyId(
        data.name.trim(),
        agencyId
      );
      if (duplicate && duplicate._id !== id) {
        throw new ValidationError(
          `Special need with name "${data.name}" already exists for this agency`
        );
      }
    }

    // Update fields
    const updated = await this._agencySpecialNeedsMasterRepository.save({
      ...existing,
      name: data.name?.trim() ?? existing.name,
      description: data.description !== undefined ? data.description?.trim() : existing.description,
    });

    return AgencySpecialNeedsMasterMapper.toResponseDto(updated);
  }
}
