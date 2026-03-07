import { inject, injectable } from "tsyringe";
import { IDeleteCategoryUsecase } from "../../interfaces/category/delete-category.interface";
import { ICategoryRepository } from "../../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class DeleteCategoryUsecase implements IDeleteCategoryUsecase {
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

  async execute(categoryId: string, agencyId: string): Promise<void> {
    // Check if category exists and belongs to agency
    const category = await this._categoryRepository.findByIdAndAgencyId(
      categoryId,
      agencyId
    );

    if (!category) {
      throw new NotFoundError(ERROR_MESSAGE.CATEGORY.NOT_FOUND);
    }

    // Soft delete category
    const deletedCategory = await this._categoryRepository.softDelete(
      categoryId,
      agencyId
    );

    if (!deletedCategory) {
      throw new NotFoundError(ERROR_MESSAGE.CATEGORY.NOT_FOUND);
    }
  }
}
