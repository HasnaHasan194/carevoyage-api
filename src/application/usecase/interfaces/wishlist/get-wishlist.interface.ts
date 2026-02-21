import { WishlistResponseDTO } from "../../../dto/response/wishlist-response.dto";

export interface PaginatedWishlistResponse {
  wishlistItems: WishlistResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface IGetWishlistUsecase {
  execute(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<WishlistResponseDTO[] | PaginatedWishlistResponse>;
}
