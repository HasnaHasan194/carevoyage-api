import { inject, injectable } from "tsyringe";
import { IGetUpcomingClientPackagesUsecase } from "../../interfaces/package/get-upcoming-client-packages.interface";
import { BrowsePackagesRequestDTO } from "../../../dto/request/browse-packages-request.dto";
import { BrowsePackagesResponseDTO } from "../../../dto/response/browse-packages-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { PackageMapper } from "../../../mapper/package.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageSortFactory } from "../../../sorting/package/package-sort.factory";
import { normalizePackageCategory } from "../../../../domain/constants/package-categories";

/**
 * Client-only use case: returns only upcoming packages (startDate > today).
 * Business rule: clients can only see packages that have not yet started.
 * Does not affect admin or agency APIs.
 */
@injectable()
export class GetUpcomingClientPackagesUsecase implements IGetUpcomingClientPackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(
    filters: Omit<BrowsePackagesRequestDTO, "startDate" | "endDate">
  ): Promise<BrowsePackagesResponseDTO> {
    if (filters.category) {
      const normalized = normalizePackageCategory(filters.category);
      if (!normalized) {
        throw new ValidationError(
          "category must be one of: Sightseeing, Adventure, Cultural, Spiritual, Wellness, Family, Honeymoon, Nature, Heritage"
        );
      }
      filters.category = normalized;
    }

    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new ValidationError("minPrice cannot be greater than maxPrice");
    }

    if (
      filters.minDuration !== undefined &&
      filters.maxDuration !== undefined &&
      filters.minDuration > filters.maxDuration
    ) {
      throw new ValidationError(
        "minDuration cannot be greater than maxDuration"
      );
    }

    const allowedSortFields = [
      "basePrice",
      "startDate",
      "endDate",
      "createdAt",
      "duration",
    ];
    if (
      !filters.sortKey &&
      filters.sortBy &&
      !allowedSortFields.includes(filters.sortBy)
    ) {
      throw new ValidationError(
        `sortBy must be one of: ${allowedSortFields.join(", ")}`
      );
    }

    const sortSpec = PackageSortFactory.resolve({
      sortKey: filters.sortKey,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    const repositoryFilters = {
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minDuration: filters.minDuration,
      maxDuration: filters.maxDuration,
      sortBy: sortSpec.sortBy,
      sortOrder: sortSpec.sortOrder as "asc" | "desc",
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    const { packages, total } = await this._packageRepository.findUpcomingClientPackages(
      repositoryFilters
    );

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
