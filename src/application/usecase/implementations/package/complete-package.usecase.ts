import { inject, injectable } from "tsyringe";
import { ICompletePackageUsecase } from "../../interfaces/package/complete-package.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class CompletePackageUsecase implements ICompletePackageUsecase {
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

   
    if (existingPackage.status !== "published") {
      throw new ValidationError(
        `Cannot complete package with status "${existingPackage.status}". Only published packages can be completed.`
      );
    }

    // Check if trip has ended
    const now = new Date();
    if (new Date(existingPackage.endDate) > now) {
      throw new ValidationError(
        "Cannot complete package before the trip end date"
      );
    }

    // Mark as completed
    const completedPackage = await this._packageRepository.updateStatus(
      packageId,
      "completed"
    );

    if (!completedPackage) {
      throw new NotFoundError("Package not found");
    }

    // Fetch itinerary
    const itinerary = completedPackage.itineraryId
      ? await this._itineraryRepository.findById(completedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(completedPackage, itinerary);
  }
}


