import { inject, injectable } from "tsyringe";
import { ISoftDeleteSpecialNeedUsecase } from "../../interfaces/agency-special-needs/soft-delete-special-need.interface";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

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
      throw new NotFoundError(ERROR_MESSAGE.SPECIAL_NEEDS.CONFIG_NOT_FOUND);
    }

    if (existing.isDeleted) {
      throw new NotFoundError(ERROR_MESSAGE.SPECIAL_NEEDS.CONFIG_ALREADY_DELETED);
    }

    // Soft delete
    await this._agencySpecialNeedsRepository.softDelete(id, agencyId);
  }
}
