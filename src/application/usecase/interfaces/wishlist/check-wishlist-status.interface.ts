export interface ICheckWishlistStatusUsecase {
  execute(userId: string, packageId: string): Promise<boolean>;
}
