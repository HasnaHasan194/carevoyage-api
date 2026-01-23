import { inject, injectable } from "tsyringe";
import { IBrowsePackagesUsecase } from "../../interfaces/package/browse-packages.interface";
import { BrowsePackagesRequestDTO, SortOrder } from "../../../dto/request/browse-packages-request.dto";
import { BrowsePackagesResponseDTO } from "../../../dto/response/browse-packages-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { PackageMapper } from "../../../mapper/package.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";


@injectable()
export class BrowsePackagesUsecase implements IBrowsePackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(
    filters: BrowsePackagesRequestDTO
  ): Promise<BrowsePackagesResponseDTO> {
    // Validate price range
    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new ValidationError(
        "minPrice cannot be greater than maxPrice"
      );
    }

    // Validate duration range
    if (
      filters.minDuration !== undefined &&
      filters.maxDuration !== undefined &&
      filters.minDuration > filters.maxDuration
    ) {
      throw new ValidationError(
        "minDuration cannot be greater than maxDuration"
      );
    }

    // Validate date range
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      if (start > end) {
        throw new ValidationError(
          "startDate cannot be after endDate"
        );
      }
    }

    // Validate sortBy field
    const allowedSortFields = ["basePrice", "startDate", "endDate", "createdAt"];
    if (filters.sortBy && !allowedSortFields.includes(filters.sortBy)) {
      throw new ValidationError(
        `sortBy must be one of: ${allowedSortFields.join(", ")}`
      );
    }

    // Prepare repository filters
    const repositoryFilters = {
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      minDuration: filters.minDuration,
      maxDuration: filters.maxDuration,
      sortBy: filters.sortBy || "basePrice",
      sortOrder: (filters.sortOrder || SortOrder.ASC) as "asc" | "desc",
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    // Call repository
    const { packages, total } = await this._packageRepository.browsePackages(
      repositoryFilters
    );

    // Fetch itineraries and activities for packages that have them
    const packagesWithDetails = await Promise.all(
      packages.map(async (pkg) => {
        let itinerary = null;
        let activitiesMap = new Map();

        if (pkg.itineraryId) {
          itinerary = await this._itineraryRepository.findById(pkg.itineraryId);

          if (itinerary) {
            const allActivityIds = itinerary.days.flatMap((day) => day.activities);
            if (allActivityIds.length > 0) {
              const activities = await this._activityRepository.findByIds(
                allActivityIds,
                pkg._id
              );
              activitiesMap = new Map(activities.map((a) => [a._id, a]));
            }
          }
        }

        return PackageMapper.toPackageResponseDto(pkg, itinerary, activitiesMap);
      })
    );

  
    const totalPages = Math.ceil(total / repositoryFilters.limit);

    return {
      data: packagesWithDetails,
      pagination: {
        page: repositoryFilters.page,
        limit: repositoryFilters.limit,
        totalItems: total,
        totalPages,
      },
    };
  }
}


