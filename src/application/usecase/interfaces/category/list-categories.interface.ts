import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";

export interface IListCategoriesUsecase {
  execute(agencyId: string, includeDeleted?: boolean): Promise<CategoryResponseDTO[]>;
}
