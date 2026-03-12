import type { PaginatedAgencyReviewsResponseDTO } from "../../../dto/response/agency-review-response.dto";

export interface ListAgencyReviewsParams {
  agencyId: string;
  page: number;
  limit: number;
}

export interface IListAgencyReviewsUseCase {
  execute(params: ListAgencyReviewsParams): Promise<PaginatedAgencyReviewsResponseDTO>;
}

