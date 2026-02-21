import { inject, injectable } from "tsyringe";
import { ISoftDeleteSpecialNeedUsecase } from "../../interfaces/agency-special-needs/soft-delete-special-need.interface";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class SoftDeleteSpecialNeedUsecase
  implements ISoftDeleteSpecialNeedUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository
  ) {}

  async execute(id: string, agencyId: string): Promise<void> {
    // Check if exists and belongs to agency
    const existing = await this._agencySpecialNeedsRepository.findByIdAndAgencyId(
      id,
      agencyId
    );

    if (!existing) {
      throw new NotFoundError("Special need configuration not found");
    }

    if (existing.isDeleted) {
      throw new NotFoundError("Special need configuration is already deleted");
    }

    // Soft delete
    await this._agencySpecialNeedsRepository.softDelete(id, agencyId);
  }
}
