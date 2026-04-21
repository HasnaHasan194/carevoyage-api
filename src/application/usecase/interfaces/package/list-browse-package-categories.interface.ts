export interface IListBrowsePackageCategoriesUsecase {
  execute(): Promise<string[]>;
}
