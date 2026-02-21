import { inject, injectable } from "tsyringe";
import { IGetAgencyPackagesUsecase, PaginatedAgencyPackagesResponse } from "../../interfaces/package/get-agency-packages.interface";
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
    status: "draft" | "published" | "completed" | "cancelled" | "all" = "all",
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PackageResponseDTO[] | PaginatedAgencyPackagesResponse> {
    // If pagination parameters are provided, use paginated method
    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, Math.floor(page) || 1);
      const limitNum = Math.max(1, Math.floor(limit) || 10);

      const { packages, total } = await this._packageRepository.findByAgencyIdPaginated(
        agencyId,
        pageNum,
        limitNum,
        status,
        false,
        search,
        category,
        sortBy,
        sortOrder
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

      return {
        packages: packagesWithItineraries,
        total,
        page: pageNum,
        limit: limitNum,
      };
    }

    // Fallback to non-paginated method for backward compatibility
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

