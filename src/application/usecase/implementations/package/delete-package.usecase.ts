import { inject, injectable } from "tsyringe";
import { IDeletePackageUsecase } from "../../interfaces/package/delete-package.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

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
      throw new NotFoundError("Package not found");
    }

   
    if (existingPackage.status !== "draft") {
      throw new ValidationError(
        "Only draft packages can be deleted. Published packages cannot be deleted."
      );
    }

    await this._packageRepository.deletePackage(packageId);
  }
}


