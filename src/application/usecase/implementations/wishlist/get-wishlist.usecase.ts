import { inject, injectable } from "tsyringe";
import {
  IGetWishlistUsecase,
  PaginatedWishlistResponse,
} from "../../interfaces/wishlist/get-wishlist.interface";
import { IWishlistRepository } from "../../../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { WishlistResponseDTO } from "../../../dto/response/wishlist-response.dto";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class GetWishlistUsecase implements IGetWishlistUsecase {
  constructor(
    @inject("IWishlistRepository")
    private _wishlistRepository: IWishlistRepository,
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<WishlistResponseDTO[] | PaginatedWishlistResponse> {
    
    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, Math.floor(page) || 1);
      const limitNum = Math.max(1, Math.floor(limit) || 10);

      const { wishlistItems, total } =
        await this._wishlistRepository.findByUserIdPaginated(
          userId,
          pageNum,
          limitNum
        );

      // Fetch packages with itineraries and activities
      const wishlistWithPackages = await Promise.all(
        wishlistItems.map(async (item) => {
          const packageEntity = await this._packageRepository.findById(item.packageId);

          // If package was deleted or doesn't exist, skip it
          if (!packageEntity || packageEntity.isDeleted) {
            return null;
          }

          // If package start date is in the past or today, hide it from wishlist
          const todayStartUTC = new Date();
          todayStartUTC.setUTCHours(0, 0, 0, 0);
          const packageStart = new Date(packageEntity.startDate);
          if (packageStart.getTime() <= todayStartUTC.getTime()) {
            return null;
          }

          let itinerary = null;
          if (packageEntity.itineraryId) {
            itinerary = await this._itineraryRepository.findById(packageEntity.itineraryId);
          }

          let activitiesMap: Map<string, any> | undefined;
          if (itinerary) {
            const allActivityIds = itinerary.days.flatMap((day) => day.activities);
            const uniqueActivityIds = [...new Set(allActivityIds)];
            const activities =
              uniqueActivityIds.length > 0
                ? await this._activityRepository.findByIds(uniqueActivityIds, packageEntity._id)
                : [];
            activitiesMap = new Map(activities.map((activity) => [activity._id, activity]));
          }

          const packageResponse = PackageMapper.toPackageResponseDto(
            packageEntity,
            itinerary || null,
            activitiesMap
          );

          return {
            id: item._id,
            userId: item.userId,
            packageId: item.packageId,
            package: packageResponse,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        })
      );

      // Filter out deleted packages
      const validWishlistItems = wishlistWithPackages.filter(
        (item): item is WishlistResponseDTO => item !== null
      );

      return {
        wishlistItems: validWishlistItems,
        total,
        page: pageNum,
        limit: limitNum,
      };
    }

    
    const wishlistItems = await this._wishlistRepository.findByUserId(userId);

    const wishlistWithPackages = await Promise.all(
      wishlistItems.map(async (item) => {
        const packageEntity = await this._packageRepository.findById(item.packageId);

        // If package was deleted or doesn't exist, skip it
        if (!packageEntity || packageEntity.isDeleted) {
          return null;
        }

        // If package start date is in the past or today, hide it from wishlist
        const todayStartUTC = new Date();
        todayStartUTC.setUTCHours(0, 0, 0, 0);
        const packageStart = new Date(packageEntity.startDate);
        if (packageStart.getTime() <= todayStartUTC.getTime()) {
          return null;
        }

        let itinerary = null;
        if (packageEntity.itineraryId) {
          itinerary = await this._itineraryRepository.findById(packageEntity.itineraryId);
        }

        let activitiesMap: Map<string, any> | undefined;
        if (itinerary) {
          const allActivityIds = itinerary.days.flatMap((day) => day.activities);
          const uniqueActivityIds = [...new Set(allActivityIds)];
          const activities =
            uniqueActivityIds.length > 0
              ? await this._activityRepository.findByIds(uniqueActivityIds, packageEntity._id)
              : [];
          activitiesMap = new Map(activities.map((activity) => [activity._id, activity]));
        }

        const packageResponse = PackageMapper.toPackageResponseDto(
          packageEntity,
          itinerary || null,
          activitiesMap
        );

        return {
          id: item._id,
          userId: item.userId,
          packageId: item.packageId,
          package: packageResponse,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    // Filter out deleted packages
    return wishlistWithPackages.filter(
      (item): item is WishlistResponseDTO => item !== null
    );
  }
}
