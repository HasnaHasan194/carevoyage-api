import { IAgencyReviewEntity } from "../../entities/agency-review.entity";

export interface IAgencyReviewRepository {
  create(data: {
    bookingId: string;
    agencyId: string;
    packageId: string;
    clientId: string;
    rating: number;
    reviewText: string;
  }): Promise<IAgencyReviewEntity>;

  findByBookingId(bookingId: string): Promise<IAgencyReviewEntity | null>;

  listAllByAgency(agencyId: string): Promise<IAgencyReviewEntity[]>;

  listByAgency(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<{ items: IAgencyReviewEntity[]; totalItems: number }>;

  getSummaryByAgency(
    agencyId: string
  ): Promise<{ averageRating: number; totalReviews: number }>;
}
