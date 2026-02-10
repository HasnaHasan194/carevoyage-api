import { inject, injectable } from "tsyringe";
import mongoose, { ClientSession } from "mongoose";
import { ICreatePackageUsecase } from "../../interfaces/package/create-package.interface";
import { CreatePackageRequestDTO } from "../../../dto/request/create-package-request.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IActivityEntity } from "../../../../domain/entities/activity.entity";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants/constants";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class CreatePackageUsecase implements ICreatePackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(
    agencyId: string,
    data: CreatePackageRequestDTO
  ): Promise<PackageResponseDTO> {

    // const packages = await this._packageRepository.findPackagesToday(agencyId);

    // if(packages.length > 2){
    //   throw new CustomError(HTTP_STATUS.BAD_REQUEST,"ONLY TWO PACKAGES ALLOWED")
    // }
    // Create a new session for this transaction
    const session: ClientSession = await mongoose.startSession();

    // Start transaction
    await session.startTransaction();

    try {
      //  Extract all activities from itinerary days and create unique set
      const allActivitiesArray = data.itineraryDays.flatMap((day) => day.activities);
      
      // Create unique activities map by name+description to avoid duplicates
      const uniqueActivitiesMap = new Map<string, typeof allActivitiesArray[0]>();
      allActivitiesArray.forEach((activity) => {
        const key = `${activity.name}-${activity.description}`;
        if (!uniqueActivitiesMap.has(key)) {
          uniqueActivitiesMap.set(key, activity);
        }
      });
      const uniqueActivities = Array.from(uniqueActivitiesMap.values());

      //  Create package (within transaction)
      const packageEntity = await this._packageRepository.save(
        {
          agencyId,
          PackageName: data.PackageName,
          description: data.description,
          category: data.category,
          tags: data.tags || [],
          status: "draft",
          meetingPoint: data.meetingPoint,
          images: data.images || [],
          maxGroupSize: data.maxGroupSize,
          basePrice: data.basePrice,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          inclusions: data.inclusions || [],
          exclusions: data.exclusions || [],
        },
        session
      );

      //  Create activities (within transaction)
      const activityEntities = await this._activityRepository.saveMany(
        uniqueActivities.map((activityData) => ({
          packageId: packageEntity._id,
          name: activityData.name,
          description: activityData.description,
          duration: activityData.duration,
          category: activityData.category,
          priceIncluded: activityData.priceIncluded ?? true,
        })),
        session
      );

      //  Create activity key (name+description) to ID map for itinerary
      const activityKeyToIdMap = new Map<string, string>();
      uniqueActivities.forEach((activityData, index) => {
        const key = `${activityData.name}-${activityData.description}`;
        const activityId = activityEntities[index]?._id;
        if (activityId) {
          activityKeyToIdMap.set(key, activityId);
        }
      });

      //  Map activity objects to IDs in itinerary days
      const itineraryDaysWithIds = data.itineraryDays.map((day) => ({
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description || "",
        activities: day.activities.map((activityData) => {
          const key = `${activityData.name}-${activityData.description}`;
          const activityId = activityKeyToIdMap.get(key);
          if (!activityId) {
            throw new ValidationError(
              ERROR_MESSAGE.PACKAGE.ACTIVITY_NOT_FOUND_IN_CREATED(activityData.name)
            );
          }
          return activityId;
        }),
        accommodation: day.accommodation || "",
        meals: day.meals,
        transfers: day.transfers || [],
      }));

      //  Create itinerary (within transaction)
      const itineraryEntity = await this._itineraryRepository.save(
        {
          packageId: packageEntity._id,
          days: itineraryDaysWithIds,
        },
        session
      );

      //  Update package with itineraryId (within transaction)
      const updatedPackage = await this._packageRepository.updateById(
        packageEntity._id,
        { itineraryId: itineraryEntity._id },
        session
      );

      if (!updatedPackage) {
        throw new ValidationError(ERROR_MESSAGE.PACKAGE.FAILED_TO_UPDATE_WITH_ITINERARY);
      }

      //  Commit transaction
      await session.commitTransaction();

      //  Return response with populated data
      const activitiesMap = new Map<string, IActivityEntity>(
        activityEntities.map((activity) => [activity._id, activity])
      );

      return PackageMapper.toPackageResponseDto(
        updatedPackage,
        itineraryEntity,
        activitiesMap
      );
    } catch (error) {
      // Rollback transaction on any error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      await session.endSession();
    }
  }
}

