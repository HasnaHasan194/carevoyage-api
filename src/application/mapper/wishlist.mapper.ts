import { IWishlistEntity } from "../../domain/entities/wishlist.entity";
import { IWishlistModel } from "../../infrastructure/database/schemas/wishlist.schema";

export class WishlistMapper {
  static toEntity(doc: IWishlistModel): IWishlistEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      packageId: String(doc.packageId),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
