import { IAgencyReviewEntity } from "../../../../domain/entities/agency-review.entity";

export interface ICreateAgencyReviewUseCase {
  execute(params: {
    clientId: string;
    bookingId: string;
    rating: number;
    reviewText: string;
  }): Promise<IAgencyReviewEntity>;
}
