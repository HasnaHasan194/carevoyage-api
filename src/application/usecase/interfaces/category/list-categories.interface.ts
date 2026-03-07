import { CategoryResponseDTO } from "../../../dto/response/category-response.dto";

export interface ListCategoriesPaginatedResult {
  categories: CategoryResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListCategoriesUsecase {
  execute(
    agencyId: string,
    includeDeleted?: boolean,
    page?: number,
    limit?: number
  ): Promise<ListCategoriesPaginatedResult>;
}
