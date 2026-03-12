export interface AgencyReviewItemDTO {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface PaginatedAgencyReviewsResponseDTO {
  reviews: AgencyReviewItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

