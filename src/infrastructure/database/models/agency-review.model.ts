import mongoose from "mongoose";
import { agencyReviewSchema, IAgencyReviewModel } from "../schemas/agency-review.schema";

export type { IAgencyReviewModel };
export const agencyReviewDB = mongoose.model<IAgencyReviewModel>(
  "agency_review",
  agencyReviewSchema
);
