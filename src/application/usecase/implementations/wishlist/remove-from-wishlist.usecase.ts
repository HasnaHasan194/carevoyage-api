import { inject, injectable } from "tsyringe";
import { IRemoveFromWishlistUsecase } from "../../interfaces/wishlist/remove-from-wishlist.interface";
import { IWishlistRepository } from "../../../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class RemoveFromWishlistUsecase implements IRemoveFromWishlistUsecase {
  constructor(
    @inject("IWishlistRepository")
    private _wishlistRepository: IWishlistRepository
  ) {}

  async execute(userId: string, packageId: string): Promise<void> {
    const wishlistItem = await this._wishlistRepository.findByUserIdAndPackageId(
      userId,
      packageId
    );

    if (!wishlistItem) {
      throw new NotFoundError(ERROR_MESSAGE.WISHLIST.NOT_IN_WISHLIST);
    }

    await this._wishlistRepository.deleteByUserIdAndPackageId(userId, packageId);
  }
}
