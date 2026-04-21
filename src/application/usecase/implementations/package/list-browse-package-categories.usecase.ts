import { inject, injectable } from "tsyringe";
import type { IListBrowsePackageCategoriesUsecase } from "../../interfaces/package/list-browse-package-categories.interface";
import type { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";

@injectable()
export class ListBrowsePackageCategoriesUsecase
  implements IListBrowsePackageCategoriesUsecase
{
  constructor(
    @inject("ICategoryRepository")
    private readonly _categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<string[]> {
    const names = await this._categoryRepository.findAllActiveCategoryNames();
    const unique = [...new Set(names)];
    unique.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    return unique;
  }
}
