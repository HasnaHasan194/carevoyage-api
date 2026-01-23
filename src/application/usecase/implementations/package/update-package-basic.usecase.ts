import { inject, injectable } from "tsyringe";
import { IUpdatePackageBasicUsecase } from "../../interfaces/package/update-package-basic.interface";
import { UpdatePackageBasicDTO } from "../../../dto/request/update-package-basic.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IPackageEntity } from "../../../../domain/entities/package.entity";

@injectable()
export class UpdatePackageBasicUsecase implements IUpdatePackageBasicUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository
  ) {}

  async execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageBasicDTO
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

    const packageUpdateData: Partial<IPackageEntity> = {};

    if (data.PackageName !== undefined)
      packageUpdateData.PackageName = data.PackageName;
    if (data.description !== undefined)
      packageUpdateData.description = data.description;
    if (data.category !== undefined) packageUpdateData.category = data.category;
    if (data.tags !== undefined) packageUpdateData.tags = data.tags;
    if (data.meetingPoint !== undefined)
      packageUpdateData.meetingPoint = data.meetingPoint;
    if (data.maxGroupSize !== undefined)
      packageUpdateData.maxGroupSize = data.maxGroupSize;
    if (data.basePrice !== undefined)
      packageUpdateData.basePrice = data.basePrice;
    if (data.startDate !== undefined)
      packageUpdateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined)
      packageUpdateData.endDate = new Date(data.endDate);
    if (data.inclusions !== undefined)
      packageUpdateData.inclusions = data.inclusions;
    if (data.exclusions !== undefined)
      packageUpdateData.exclusions = data.exclusions;
    if (data.images !== undefined)
      packageUpdateData.images = data.images;

    const updatedPackage = await this._packageRepository.updateById(
      packageId,
      packageUpdateData
    );

    if (!updatedPackage) {
      throw new NotFoundError("Package not found");
    }

    const itinerary = updatedPackage.itineraryId
      ? await this._itineraryRepository.findById(updatedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(updatedPackage, itinerary);
  }
}

