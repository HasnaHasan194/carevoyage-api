import { inject, injectable } from "tsyringe";
import { IDeletePackageUsecase } from "../../interfaces/package/delete-package.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class DeletePackageUsecase implements IDeletePackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string, agencyId: string): Promise<void> {
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

   
    if (existingPackage.status !== "draft") {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE.ONLY_DRAFT_CAN_BE_DELETED);
    }

    await this._packageRepository.deletePackage(packageId);
  }
}


