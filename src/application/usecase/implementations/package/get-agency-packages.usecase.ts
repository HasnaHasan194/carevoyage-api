import { inject, injectable } from "tsyringe";
import { IGetAgencyPackagesUsecase } from "../../interfaces/package/get-agency-packages.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { PackageMapper } from "../../../mapper/package.mapper";
import { ItineraryMapper } from "../../../mapper/itinerary.mapper";

@injectable()
export class GetAgencyPackagesUsecase implements IGetAgencyPackagesUsecase {
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
    status: "draft" | "published" | "completed" | "cancelled" | "all" = "all"
  ): Promise<PackageResponseDTO[]> {
    const packages = await this._packageRepository.findByAgencyId(
      agencyId,
      status
    );
    

    // Fetch itineraries and activities for packages that have them
    const packagesWithItineraries = await Promise.all(
      packages.map(async (pkg) => {
        if (!pkg.itineraryId) {
          return PackageMapper.toPackageResponseDto(pkg, null);
        }

        const itinerary = await this._itineraryRepository.findById(
          pkg.itineraryId
        );

        if (!itinerary) {
          return PackageMapper.toPackageResponseDto(pkg, null);
        }

        // Collect all activity IDs from itinerary days
        const allActivityIds = itinerary.days.flatMap((day) => day.activities);
        const uniqueActivityIds = [...new Set(allActivityIds)];

        // Fetch all activities
        const activities =
          uniqueActivityIds.length > 0
            ? await this._activityRepository.findByIds(uniqueActivityIds, pkg._id)
            : [];

        // Create activities map for quick lookup
        const activitiesMap = new Map(
          activities.map((activity) => [activity._id, activity])
        );

        return PackageMapper.toPackageResponseDto(pkg, itinerary, activitiesMap);
      })
    );

    return packagesWithItineraries;
  }
}

