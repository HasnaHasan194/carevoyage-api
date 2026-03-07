import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IBlockUnblockAgencyUsecase } from "../../interfaces/admin/blockUnblockAgency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";

@injectable()
export class BlockUnblockAgencyUsecase implements IBlockUnblockAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
  
    // @inject('IPackageRepository')
    // private _packageRepository : IPackageRepository
  ) {}

  async execute(agencyId: string, isBlocked: boolean): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);

    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    await this._agencyRepository.updateBlockStatus(agencyId, isBlocked);

  

   

  }
}





