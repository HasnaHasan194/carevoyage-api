import { inject, injectable } from "tsyringe";
import { IListCategoriesUsecase } from "../../interfaces/category/list-categories.interface";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";
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
    includeDeleted: boolean = false
  ): Promise<CategoryResponseDTO[]> {
    const categories = await this._categoryRepository.findByAgencyId(
      agencyId,
      includeDeleted
    );

    return categories.map((category) => CategoryMapper.toResponseDto(category));
  }
}
