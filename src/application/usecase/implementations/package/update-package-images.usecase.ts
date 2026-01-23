import { inject, injectable } from "tsyringe";
import { IUpdatePackageImagesUsecase } from "../../interfaces/package/update-package-images.interface";
import { UpdatePackageImagesDTO } from "../../../dto/request/update-package-images.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class UpdatePackageImagesUsecase implements IUpdatePackageImagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository
  ) {}

  async execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageImagesDTO
  ): Promise<PackageResponseDTO> {
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!existingPackage) {
      throw new NotFoundError("Package not found");
    }

    
    if (existingPackage.status === "published") {
      throw new ValidationError(
        "Cannot edit published packages. Please unpublish first."
      );
    }

    const updatedPackage = await this._packageRepository.updateById(packageId, {
      images: data.images || [],
    });

    if (!updatedPackage) {
      throw new NotFoundError("Package not found");
    }

    const itinerary = updatedPackage.itineraryId
      ? await this._itineraryRepository.findById(updatedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(updatedPackage, itinerary);
  }
}


