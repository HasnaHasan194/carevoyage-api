export interface IDeleteCategoryUsecase {
  execute(categoryId: string, agencyId: string): Promise<void>;
}
