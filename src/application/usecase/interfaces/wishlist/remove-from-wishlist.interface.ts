export interface IRemoveFromWishlistUsecase {
  execute(userId: string, packageId: string): Promise<void>;
}
