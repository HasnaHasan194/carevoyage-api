import { inject, injectable } from "tsyringe";
import { IDeleteAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/delete-agency-special-needs-master.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class DeleteAgencySpecialNeedsMasterUsecase
  implements IDeleteAgencySpecialNeedsMasterUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(id: string, agencyId: string): Promise<void> {
    // Check if exists and belongs to agency
    const existing = await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
      id,
      agencyId
    );

    if (!existing) {
      throw new NotFoundError(ERROR_MESSAGE.SPECIAL_NEEDS.NOT_FOUND);
    }

    if (existing.isDeleted) {
      throw new NotFoundError(ERROR_MESSAGE.SPECIAL_NEEDS.CANNOT_UPDATE_DELETED);
    }

    // Soft delete
    await this._agencySpecialNeedsMasterRepository.softDelete(id, agencyId);
  }
}
