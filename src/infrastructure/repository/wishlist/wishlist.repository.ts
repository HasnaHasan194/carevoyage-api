import { ClientSession } from "mongoose";
import { IWishlistEntity } from "../../../domain/entities/wishlist.entity";
import { IWishlistRepository } from "../../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";
import { wishlistDB } from "../../database/models/wishlist.model";
import { IWishlistModel } from "../../database/schemas/wishlist.schema";
import { BaseRepository } from "../baseRepository";
import { WishlistMapper } from "../../../application/mapper/wishlist.mapper";

export class WishlistRepository
  extends BaseRepository<IWishlistModel, IWishlistEntity>
  implements IWishlistRepository
{
  constructor() {
    super(wishlistDB, WishlistMapper.toEntity);
  }

  async findByUserId(userId: string): Promise<IWishlistEntity[]> {
    const wishlistItems = await wishlistDB
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return wishlistItems.map((item) => WishlistMapper.toEntity(item));
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ wishlistItems: IWishlistEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [wishlistItems, total] = await Promise.all([
      wishlistDB
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      wishlistDB.countDocuments({ userId }).exec(),
    ]);

    return {
      wishlistItems: wishlistItems.map((item) => WishlistMapper.toEntity(item)),
      total,
    };
  }

  async findByUserIdAndPackageId(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null> {
    const wishlistItem = await wishlistDB
      .findOne({ userId, packageId })
      .exec();
    if (!wishlistItem) return null;
    return WishlistMapper.toEntity(wishlistItem);
  }

  async deleteByUserIdAndPackageId(
    userId: string,
    packageId: string,
    session?: ClientSession
  ): Promise<IWishlistEntity | null> {
    const query = wishlistDB.findOneAndDelete({ userId, packageId });

    if (session) {
      query.session(session);
    }

    const doc = await query.exec();
    if (!doc) return null;
    return WishlistMapper.toEntity(doc);
  }

  async countByUserId(userId: string): Promise<number> {
    return wishlistDB.countDocuments({ userId }).exec();
  }
}
