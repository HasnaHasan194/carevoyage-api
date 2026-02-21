import { inject, injectable } from "tsyringe";
import { ICheckWishlistStatusUsecase } from "../../interfaces/wishlist/check-wishlist-status.interface";
import { IWishlistRepository } from "../../../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";

@injectable()
export class CheckWishlistStatusUsecase implements ICheckWishlistStatusUsecase {
  constructor(
    @inject("IWishlistRepository")
    private _wishlistRepository: IWishlistRepository
  ) {}

  async execute(userId: string, packageId: string): Promise<boolean> {
    const wishlistItem = await this._wishlistRepository.findByUserIdAndPackageId(
      userId,
      packageId
    );
    return wishlistItem !== null;
  }
}
