import { inject, injectable } from "tsyringe";
import { ICancelPackageUsecase } from "../../interfaces/package/cancel-package.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class CancelPackageUsecase implements ICancelPackageUsecase {
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

    //  Only published packages can be cancelled
    if (existingPackage.status !== "published") {
      throw new ValidationError(
        `Cannot cancel package with status "${existingPackage.status}". Only published packages can be cancelled.`
      );
    }

    // Cancel package
    const cancelledPackage = await this._packageRepository.updateStatus(
      packageId,
      "cancelled"
    );

    if (!cancelledPackage) {
      throw new NotFoundError("Package not found");
    }

    // Fetch itinerary
    const itinerary = cancelledPackage.itineraryId
      ? await this._itineraryRepository.findById(cancelledPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(cancelledPackage, itinerary);
  }
}


