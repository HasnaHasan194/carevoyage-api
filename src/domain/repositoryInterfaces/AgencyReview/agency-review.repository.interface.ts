import type { IAgencyReviewEntity } from "../../entities/agency-review.entity";
import type { IBaseRepository } from "../baseRepository.interface";

export interface IAgencyReviewRepository extends IBaseRepository<IAgencyReviewEntity> {
  findByBookingId(bookingId: string): Promise<IAgencyReviewEntity | null>;

  listByAgency(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<{ reviews: IAgencyReviewEntity[]; total: number }>;

  getSummaryByAgency(agencyId: string): Promise<{ averageRating: number; count: number }>;
}

