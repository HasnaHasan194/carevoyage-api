import mongoose from "mongoose";
import { agencyReviewSchema, type IAgencyReviewModel } from "../schemas/agency-review.schema";

export const agencyReviewDB = mongoose.model<IAgencyReviewModel>(
  "agency_review",
  agencyReviewSchema
);

