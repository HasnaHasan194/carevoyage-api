export interface AgencyReviewItemDTO {
  id: string;
  clientName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface AgencyReviewsForPackageDTO {
  packageId: string;
  packageName: string;
  averageRating: number;
  totalReviews: number;
  reviews: AgencyReviewItemDTO[];
}

export interface ListAgencyReviewsByPackageResult {
  packages: AgencyReviewsForPackageDTO[];
  totalPackages: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListAgencyReviewsByPackageUseCase {
  execute(params: {
    agencyId: string;
    page: number;
    limit: number;
  }): Promise<ListAgencyReviewsByPackageResult>;
}

