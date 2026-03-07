import { inject, injectable } from "tsyringe";
import mongoose, { ClientSession } from "mongoose";
import { IUpdatePackageItineraryUsecase } from "../../interfaces/package/update-package-itinerary.interface";
import { UpdatePackageItineraryDTO } from "../../../dto/request/update-package-itinerary.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IActivityEntity } from "../../../../domain/entities/activity.entity";
import { isPackageEditable } from "../../../../domain/constants/package-categories";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class UpdatePackageItineraryUsecase implements IUpdatePackageItineraryUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository,
  ) {}

  async execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageItineraryDTO,
  ): Promise<PackageResponseDTO> {
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId,
    );

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Only allow editing for draft and published statuses
    if (!isPackageEditable(existingPackage.status)) {
      throw new ValidationError(
        ERROR_MESSAGE.PACKAGE.CANNOT_EDIT_STATUS(existingPackage.status),
      );
    }

    if (!data.itineraryDays || !existingPackage.itineraryId) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE.ITINERARY_NOT_FOUND);
    }

    // Start transaction for atomic updates
    const session: ClientSession = await mongoose.startSession();
    await session.startTransaction();

    try {
      const activitiesToUpdate: Map<
        string,
        {
          id: string;
          name: string;
          description: string;
          duration: number;
          category: string;
          priceIncluded: boolean;
        }
      > = new Map();
      const existingActivityIds: string[] = [];
      const newActivities: Array<{
        name: string;
        description: string;
        duration: number;
        category: string;
        priceIncluded: boolean;
      }> = [];

      data.itineraryDays.forEach((day) => {
        day.activities?.forEach((activity) => {
          if (activity.id) {
            if (
              activity.name &&
              activity.duration &&
              activity.category &&
              activity.description !== undefined &&
              activity.description !== null
            ) {
              activitiesToUpdate.set(activity.id, {
                id: activity.id,
                name: activity.name,
                description: activity.description || "",
                duration: activity.duration,
                category: activity.category,
                priceIncluded: activity.priceIncluded ?? true,
              });
            } else {
              
              existingActivityIds.push(activity.id);
            }
          } else if (
            activity.name &&
            activity.duration &&
            activity.category &&
            activity.description !== undefined &&
            activity.description !== null
          ) {
          
            newActivities.push({
              name: activity.name,
              description: activity.description || "",
              duration: activity.duration,
              category: activity.category,
              priceIncluded: activity.priceIncluded ?? true,
            });
          }
        });
      });

      // Validate all existing activities (both to update and to keep) exist
      const allExistingIds = [
        ...new Set([
          ...Array.from(activitiesToUpdate.keys()),
          ...existingActivityIds,
        ]),
      ];
      if (allExistingIds.length > 0) {
        const existingActivities = await this._activityRepository.findByIds(
          allExistingIds,
          packageId,
          session,
        );
        if (existingActivities.length !== allExistingIds.length) {
          throw new NotFoundError(
            ERROR_MESSAGE.PACKAGE.ACTIVITIES_NOT_FOUND_OR_NOT_BELONG,
          );
        }
      }

      // Update existing activities that have new data
      if (activitiesToUpdate.size > 0) {
        const updatePromises = Array.from(activitiesToUpdate.values()).map(
          (activity) =>
            this._activityRepository.updateById(
              activity.id,
              {
                name: activity.name,
                description: activity.description,
                duration: activity.duration,
                category: activity.category,
                priceIncluded: activity.priceIncluded,
              },
              session,
            ),
        );
        await Promise.all(updatePromises);
      }

      // Create new activities 
      const createdActivities: IActivityEntity[] = [];
      let uniqueNewActivities: Array<{
        name: string;
        description: string;
        duration: number;
        category: string;
        priceIncluded: boolean;
      }> = [];

      if (newActivities.length > 0) {
        // Create unique activities map by name+description to avoid duplicates
        const uniqueActivitiesMap = new Map<
          string,
          (typeof newActivities)[0]
        >();
        newActivities.forEach((activity) => {
          const key = `${activity.name}-${activity.description}`;
          if (!uniqueActivitiesMap.has(key)) {
            uniqueActivitiesMap.set(key, activity);
          }
        });
        uniqueNewActivities = Array.from(uniqueActivitiesMap.values());

        const created = await this._activityRepository.saveMany(
          uniqueNewActivities.map((activityData) => ({
            packageId,
            name: activityData.name,
            description: activityData.description,
            duration: activityData.duration,
            category: activityData.category,
            priceIncluded: activityData.priceIncluded,
          })),
          session,
        );
        createdActivities.push(...created);
      }

      // Create activity key (name+description) to ID map for new activities
      const activityKeyToIdMap = new Map<string, string>();
      uniqueNewActivities.forEach((activityData, index) => {
        const key = `${activityData.name}-${activityData.description}`;
        const activityId = createdActivities[index]?._id;
        if (activityId) {
          activityKeyToIdMap.set(key, activityId);
        }
      });

      
      const itineraryDaysWithIds = data.itineraryDays.map((day) => ({
        dayNumber: day.dayNumber!,
        title: day.title!,
        description: day.description!,
        activities: day.activities!.map((activity) => {
          
          if (activity.id) {
            return activity.id;
          }
          //  find the created activity by name+description
          const key = `${activity.name}-${activity.description}`;
          const activityId = activityKeyToIdMap.get(key);
          if (!activityId) {
            throw new ValidationError(
              ERROR_MESSAGE.PACKAGE.ACTIVITY_NOT_FOUND_IN_CREATED(
                activity.name!,
              ),
            );
          }
          return activityId;
        }),
        accommodation: day.accommodation ?? "",
        meals: {
          breakfast: day.meals?.breakfast ?? false,
          lunch: day.meals?.lunch ?? false,
          dinner: day.meals?.dinner ?? false,
        },
        transfers: day.transfers || [],
      }));

      // Update itinerary
      await this._itineraryRepository.updateDays(
        existingPackage.itineraryId,
        itineraryDaysWithIds,
        session,
      );

      // Commit transaction
      await session.commitTransaction();

      // Fetch updated package and itinerary
      const updatedPackage = await this._packageRepository.findById(packageId);
      if (!updatedPackage) {
        throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
      }

      const itinerary = await this._itineraryRepository.findById(
        existingPackage.itineraryId,
      );

      // Fetch all activities for response
      let activitiesMap: Map<string, IActivityEntity> | undefined = undefined;
      if (itinerary) {
        const allActivityIds = itinerary.days.flatMap((day) => day.activities);
        const uniqueActivityIds = [...new Set(allActivityIds)];

        if (uniqueActivityIds.length > 0) {
          const activities = await this._activityRepository.findByIds(
            uniqueActivityIds,
            packageId,
          );
          activitiesMap = new Map(activities.map((a) => [a._id, a]));
        }
      }

      return PackageMapper.toPackageResponseDto(
        updatedPackage,
        itinerary,
        activitiesMap,
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
