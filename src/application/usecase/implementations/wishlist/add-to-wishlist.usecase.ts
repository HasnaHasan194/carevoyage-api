import { inject, injectable } from "tsyringe";
import { IAddToWishlistUsecase } from "../../interfaces/wishlist/add-to-wishlist.interface";
import { IWishlistRepository } from "../../../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { WishlistResponseDTO } from "../../../dto/response/wishlist-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { PackageMapper } from "../../../mapper/package.mapper";

@injectable()
export class AddToWishlistUsecase implements IAddToWishlistUsecase {
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

  async execute(userId: string, packageId: string): Promise<WishlistResponseDTO> {
    // Check if package exists
    const packageEntity = await this._packageRepository.findById(packageId);
    if (!packageEntity) {
      throw new NotFoundError(ERROR_MESSAGE.WISHLIST.PACKAGE_NOT_FOUND);
    }

    // Check package status - only published packages can be added
    if (packageEntity.status !== "published") {
      if (packageEntity.status === "cancelled") {
        throw new ValidationError(ERROR_MESSAGE.WISHLIST.PACKAGE_CANCELLED);
      }
      throw new ValidationError(ERROR_MESSAGE.WISHLIST.PACKAGE_NOT_PUBLISHED);
    }

    // Check if already in wishlist
    const existingWishlistItem = await this._wishlistRepository.findByUserIdAndPackageId(
      userId,
      packageId
    );
    if (existingWishlistItem) {
      throw new ValidationError(ERROR_MESSAGE.WISHLIST.ALREADY_IN_WISHLIST);
    }

    // Add to wishlist
    const wishlistEntity = await this._wishlistRepository.save({
      userId,
      packageId,
    });

    // Fetch package with itinerary and activities for response
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
      id: wishlistEntity._id,
      userId: wishlistEntity.userId,
      packageId: wishlistEntity.packageId,
      package: packageResponse,
      createdAt: wishlistEntity.createdAt,
      updatedAt: wishlistEntity.updatedAt,
    };
  }
}
