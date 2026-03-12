import type { IAgencyReviewEntity } from "../../domain/entities/agency-review.entity";
import type { IAgencyReviewModel } from "../../infrastructure/database/schemas/agency-review.schema";

export class AgencyReviewMapper {
  static toEntity(doc: IAgencyReviewModel): IAgencyReviewEntity {
    return {
      _id: String(doc._id),
      bookingId: String(doc.bookingId),
      agencyId: String(doc.agencyId),
      packageId: String(doc.packageId),
      clientId: String(doc.clientId),
      rating: doc.rating,
      reviewText: doc.reviewText,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

