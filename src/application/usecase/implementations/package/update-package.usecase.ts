import { inject, injectable } from "tsyringe";
import { IUpdatePackageUsecase } from "../../interfaces/package/update-package.interface";
import { UpdatePackageRequestDTO } from "../../../dto/request/update-package-request.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { IPackageEntity } from "../../../../domain/entities/package.entity";
import { isPackageEditable } from "../../../../domain/constants/package-categories";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class UpdatePackageUsecase implements IUpdatePackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageRequestDTO
  ): Promise<PackageResponseDTO> {
    // Find package and verify 
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Only allow editing for draft and published statuses
    if (!isPackageEditable(existingPackage.status)) {
      throw new ValidationError(
        ERROR_MESSAGE.PACKAGE.CANNOT_EDIT_STATUS(existingPackage.status)
      );
    }

    // Validate activities if itineraryDays are being updated
    if (data.itineraryDays) {
      const allActivityIds = data.itineraryDays.flatMap((day) => day.activities || []);
      const uniqueActivityIds = [...new Set(allActivityIds)];

      if (uniqueActivityIds.length > 0) {
        const activities = await this._activityRepository.findByIds(
          uniqueActivityIds,
          packageId
        );
        if (activities.length !== uniqueActivityIds.length) {
          throw new NotFoundError(ERROR_MESSAGE.PACKAGE.ACTIVITIES_NOT_FOUND);
        }
      }
    }

    // Update package fields 
    const packageUpdateData: Partial<IPackageEntity> = {};

    if (data.PackageName !== undefined)
      packageUpdateData.PackageName = data.PackageName;
    if (data.description !== undefined)
      packageUpdateData.description = data.description;
    if (data.category !== undefined) packageUpdateData.category = data.category;
    if (data.tags !== undefined) packageUpdateData.tags = data.tags;
    if (data.meetingPoint !== undefined)
      packageUpdateData.meetingPoint = data.meetingPoint;
    if (data.images !== undefined) packageUpdateData.images = data.images;
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

    const updatedPackage = await this._packageRepository.updateById(
      packageId,
      packageUpdateData
    );

    if (!updatedPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Update itinerary if provided
    if (data.itineraryDays && existingPackage.itineraryId) {
      await this._itineraryRepository.updateDays(
        existingPackage.itineraryId,
        data.itineraryDays.map((day) => ({
          dayNumber: day.dayNumber!,
          title: day.title!,
          description: day.description!,
          activities: day.activities!,
          accommodation: day.accommodation!,
          meals: {
            breakfast: day.meals?.breakfast ?? false,
            lunch: day.meals?.lunch ?? false,
            dinner: day.meals?.dinner ?? false,
          },
          transfers: day.transfers || [],
        }))
      );
    }

    // Fetch updated itinerary
    const itinerary = updatedPackage.itineraryId
      ? await this._itineraryRepository.findById(updatedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(updatedPackage, itinerary);
  }
}


