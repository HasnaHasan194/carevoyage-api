import { inject, injectable } from "tsyringe";
import { ICreateCategoryUsecase } from "../../interfaces/category/create-category.interface";
import { CreateCategoryRequestDTO } from "../../../dto/request/create-category-request.dto";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";
import { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { CategoryMapper } from "../../../mapper/category.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class CreateCategoryUsecase implements ICreateCategoryUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async execute(
    agencyId: string,
    data: CreateCategoryRequestDTO
  ): Promise<CategoryResponseDTO> {
    // Check if category with same name already exists for this agency
    const existingCategory = await this._categoryRepository.findByNameAndAgencyId(
      data.name,
      agencyId
    );

    if (existingCategory) {
      throw new ValidationError(
        `Category with name "${data.name}" already exists for this agency`
      );
    }

    // Create category
    const category = await this._categoryRepository.save({
      name: data.name.trim(),
      agencyId,
      isDeleted: false,
    });

    return CategoryMapper.toResponseDto(category);
  }
}
