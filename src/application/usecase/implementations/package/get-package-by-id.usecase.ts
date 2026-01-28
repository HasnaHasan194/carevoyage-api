import { inject, injectable } from "tsyringe";
import { IGetPackageByIdUsecase } from "../../interfaces/package/get-package-by-id.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IActivityEntity } from "../../../../domain/entities/activity.entity";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetPackageByIdUsecase implements IGetPackageByIdUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(packageId: string, agencyId: string): Promise<PackageResponseDTO> {
    const packageEntity = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!packageEntity) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Fetch itinerary if exists
    let itinerary = null;
    let activitiesMap: Map<string, IActivityEntity> | undefined = undefined;

    if (packageEntity.itineraryId) {
      itinerary = await this._itineraryRepository.findById(packageEntity.itineraryId);
      
      // Fetch all activities for the itinerary
      if (itinerary) {
        const allActivityIds = itinerary.days.flatMap(day => day.activities);
        const uniqueActivityIds = [...new Set(allActivityIds)];
        
        if (uniqueActivityIds.length > 0) {
          const activities = await this._activityRepository.findByIds(
            uniqueActivityIds,
            packageId
          );
          activitiesMap = new Map(activities.map(a => [a._id, a]));
        }
      }
    }

    return PackageMapper.toPackageResponseDto(packageEntity, itinerary, activitiesMap);
  }
}





