import { inject, injectable } from "tsyringe";
import { IListActiveCategoriesUsecase } from "../../interfaces/category/list-active-categories.interface";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";
import { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { CategoryMapper } from "../../../mapper/category.mapper";

@injectable()
export class ListActiveCategoriesUsecase implements IListActiveCategoriesUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async execute(agencyId: string): Promise<CategoryResponseDTO[]> {
    const categories = await this._categoryRepository.findActiveByAgencyId(agencyId);

    return categories.map((category) => CategoryMapper.toResponseDto(category));
  }
}
