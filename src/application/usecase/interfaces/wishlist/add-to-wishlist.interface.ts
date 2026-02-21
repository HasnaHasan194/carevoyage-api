import { WishlistResponseDTO } from "../../../dto/response/wishlist-response.dto";

export interface IAddToWishlistUsecase {
  execute(userId: string, packageId: string): Promise<WishlistResponseDTO>;
}
