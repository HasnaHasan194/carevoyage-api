export interface ListAgencyReviewsResult {
  items: Array<{
    id: string;
    clientName: string;
    rating: number;
    reviewText: string;
    createdAt: string;
  }>;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  averageRating: number;
}

export interface IListAgencyReviewsUseCase {
  execute(params: {
    agencyId: string;
    page: number;
    limit: number;
  }): Promise<ListAgencyReviewsResult>;
}
