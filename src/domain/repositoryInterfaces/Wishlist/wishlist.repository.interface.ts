import { ClientSession } from "mongoose";
import { IWishlistEntity } from "../../entities/wishlist.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWishlistRepository extends IBaseRepository<IWishlistEntity> {
  findByUserId(userId: string): Promise<IWishlistEntity[]>;
  
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ wishlistItems: IWishlistEntity[]; total: number }>;
  
  findByUserIdAndPackageId(
    userId: string,
    packageId: string
  ): Promise<IWishlistEntity | null>;
  
  deleteByUserIdAndPackageId(
    userId: string,
    packageId: string,
    session?: ClientSession
  ): Promise<IWishlistEntity | null>;
  
  countByUserId(userId: string): Promise<number>;
}
