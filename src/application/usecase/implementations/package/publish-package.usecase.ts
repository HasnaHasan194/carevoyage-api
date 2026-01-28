import { inject, injectable } from "tsyringe";
import { IPublishPackageUsecase } from "../../interfaces/package/publish-package.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

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
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Validate package has itinerary
    if (!existingPackage.itineraryId) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE.MUST_HAVE_ITINERARY_BEFORE_PUBLISHING);
    }

    // Check if already published
    if (existingPackage.status === "published") {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE.ALREADY_PUBLISHED);
    }

    // Cannot publish if completed or cancelled
    if (
      existingPackage.status === "completed" ||
      existingPackage.status === "cancelled"
    ) {
      throw new ValidationError(
        ERROR_MESSAGE.PACKAGE.CANNOT_PUBLISH_STATUS(existingPackage.status)
      );
    }

    // Publish package
    const publishedPackage = await this._packageRepository.updateStatus(
      packageId,
      "published"
    );

    if (!publishedPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Fetch itinerary
    const itinerary = publishedPackage.itineraryId
      ? await this._itineraryRepository.findById(publishedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(publishedPackage, itinerary);
  }
}





