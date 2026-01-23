import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IBlockUnblockAgencyUsecase } from "../../interfaces/admin/blockUnblockAgency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class BlockUnblockAgencyUsecase implements IBlockUnblockAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(agencyId: string, isBlocked: boolean): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);

    if (!agency) {
      throw new NotFoundError("Agency not found");
    }

    await this._agencyRepository.updateBlockStatus(agencyId, isBlocked);
  }
}


