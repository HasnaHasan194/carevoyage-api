import mongoose, { Document, Types } from "mongoose";
import { IAgencyEntity } from "../../../domain/entities/Agency.entity";
import { agencySchema } from "../schemas/agency.schema";

export interface IAgencyModel
  extends Omit<IAgencyEntity, "_id" | "userId">,
    Document {
  userId: Types.ObjectId;
}

export const agencyDB= mongoose.model<IAgencyModel>("agency", agencySchema);
