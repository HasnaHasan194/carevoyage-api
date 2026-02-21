import { inject, injectable } from "tsyringe";
import { IUpdateCategoryUsecase } from "../../interfaces/category/update-category.interface";
import { UpdateCategoryRequestDTO } from "../../../dto/request/update-category-request.dto";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";
import { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { CategoryMapper } from "../../../mapper/category.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class UpdateCategoryUsecase implements IUpdateCategoryUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async execute(
    categoryId: string,
    agencyId: string,
    data: UpdateCategoryRequestDTO
  ): Promise<CategoryResponseDTO> {
    // Check if category exists and belongs to agency
    const existingCategory = await this._categoryRepository.findByIdAndAgencyId(
      categoryId,
      agencyId
    );

    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    // Check if another category with same name exists (excluding current category)
    const duplicateCategory = await this._categoryRepository.findByNameAndAgencyId(
      data.name,
      agencyId
    );

    if (duplicateCategory && duplicateCategory._id !== categoryId) {
      throw new ValidationError(
        `Category with name "${data.name}" already exists for this agency`
      );
    }

    // Update category
    const updatedCategory = await this._categoryRepository.updateById(categoryId, {
      name: data.name.trim(),
    });

    if (!updatedCategory) {
      throw new NotFoundError("Category not found");
    }

    return CategoryMapper.toResponseDto(updatedCategory);
  }
}
