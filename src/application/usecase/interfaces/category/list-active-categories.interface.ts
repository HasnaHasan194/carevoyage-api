import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";

export interface IListActiveCategoriesUsecase {
  execute(agencyId: string): Promise<CategoryResponseDTO[]>;
}
