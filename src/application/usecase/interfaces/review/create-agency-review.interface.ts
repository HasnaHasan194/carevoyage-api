export interface CreateAgencyReviewInput {
  bookingId: string;
  rating: number;
  reviewText: string;
  userId: string;
}

export interface ICreateAgencyReviewUseCase {
  execute(input: CreateAgencyReviewInput): Promise<void>;
}

