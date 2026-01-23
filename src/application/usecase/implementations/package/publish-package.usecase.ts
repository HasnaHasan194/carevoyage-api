import { inject, injectable } from "tsyringe";
import { IPublishPackageUsecase } from "../../interfaces/package/publish-package.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class PublishPackageUsecase implements IPublishPackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository
  ) {}

  async execute(
    packageId: string,
    agencyId: string
  ): Promise<PackageResponseDTO> {
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!existingPackage) {
      throw new NotFoundError("Package not found");
    }

    // Validate package has itinerary
    if (!existingPackage.itineraryId) {
      throw new ValidationError(
        "Package must have an itinerary before publishing"
      );
    }

    // Check if already published
    if (existingPackage.status === "published") {
      throw new ValidationError("Package is already published");
    }

    // Cannot publish if completed or cancelled
    if (
      existingPackage.status === "completed" ||
      existingPackage.status === "cancelled"
    ) {
      throw new ValidationError(
        `Cannot publish package with status: ${existingPackage.status}`
      );
    }

    // Publish package
    const publishedPackage = await this._packageRepository.updateStatus(
      packageId,
      "published"
    );

    if (!publishedPackage) {
      throw new NotFoundError("Package not found");
    }

    // Fetch itinerary
    const itinerary = publishedPackage.itineraryId
      ? await this._itineraryRepository.findById(publishedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(publishedPackage, itinerary);
  }
}


