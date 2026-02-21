import { inject, injectable } from "tsyringe";
import { IDeleteAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/delete-agency-special-needs-master.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

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
      throw new NotFoundError("Special need not found");
    }

    if (existing.isDeleted) {
      throw new NotFoundError("Special need is already deleted");
    }

    // Soft delete
    await this._agencySpecialNeedsMasterRepository.softDelete(id, agencyId);
  }
}
