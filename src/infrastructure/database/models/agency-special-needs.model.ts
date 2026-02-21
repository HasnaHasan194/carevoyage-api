import mongoose from "mongoose";
import { agencySpecialNeedsSchema } from "../schemas/agency-special-needs.schema";
import { IAgencySpecialNeedsModel } from "./interfaces/agency-special-needs.model.interface";

export const agencySpecialNeedsDB = mongoose.model<IAgencySpecialNeedsModel>(
  "agency_special_needs",
  agencySpecialNeedsSchema
);
