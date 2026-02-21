import { CreateCategoryRequestDTO } from "../../../dto/request/create-category-request.dto";
import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";

export interface ICreateCategoryUsecase {
  execute(agencyId: string, data: CreateCategoryRequestDTO): Promise<CategoryResponseDTO>;
}
