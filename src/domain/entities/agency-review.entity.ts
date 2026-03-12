export interface IAgencyReviewEntity {
  _id: string;
  bookingId: string;
  agencyId: string;
  packageId: string;
  clientId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

