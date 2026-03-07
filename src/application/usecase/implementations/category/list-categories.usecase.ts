import { inject, injectable } from "tsyringe";
import {
  IListCategoriesUsecase,
  type ListCategoriesPaginatedResult,
} from "../../interfaces/category/list-categories.interface";
import { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { CategoryMapper } from "../../../mapper/category.mapper";

@injectable()
export class ListCategoriesUsecase implements IListCategoriesUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async execute(
    agencyId: string,
    includeDeleted: boolean = false,
    page: number = 1,
    limit: number = 10
  ): Promise<ListCategoriesPaginatedResult> {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;

    const [categories, total] = await Promise.all([
      this._categoryRepository.findByAgencyIdPaginated(
        agencyId,
        includeDeleted,
        safePage,
        safeLimit
      ),
      this._categoryRepository.countByAgencyId(agencyId, includeDeleted),
    ]);

    const categoryDtos = categories.map((category) =>
      CategoryMapper.toResponseDto(category)
    );
    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

    return {
      categories: categoryDtos,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}
