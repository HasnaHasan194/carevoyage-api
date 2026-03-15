import { Schema, Document, Types } from "mongoose";
import { IAgencyReviewEntity } from "../../../domain/entities/agency-review.entity";

export interface IAgencyReviewModel
  extends Omit<IAgencyReviewEntity, "_id" | "bookingId" | "agencyId" | "packageId" | "clientId">,
    Document {
  bookingId: Types.ObjectId;
  agencyId: Types.ObjectId;
  packageId: Types.ObjectId;
  clientId: Types.ObjectId;
}

export const agencyReviewSchema = new Schema<IAgencyReviewModel>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: true,
      unique: true,
      index: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "package",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

agencyReviewSchema.index({ agencyId: 1, createdAt: -1 });
