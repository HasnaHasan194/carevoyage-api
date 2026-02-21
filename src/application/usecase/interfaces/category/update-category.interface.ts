import { UpdateCategoryRequestDTO } from "../../../dto/request/update-category-request.dto";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";

export interface IUpdateCategoryUsecase {
  execute(
    categoryId: string,
    agencyId: string,
    data: UpdateCategoryRequestDTO
  ): Promise<CategoryResponseDTO>;
}
