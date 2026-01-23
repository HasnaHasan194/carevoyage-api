import mongoose, { Document, Types } from "mongoose";
import { IPackageEntity } from "../../../domain/entities/package.entity";
import { packageSchema } from "../schemas/package.schema";

export interface IPackageModel
  extends Omit<IPackageEntity, "_id" | "agencyId" | "itineraryId">,
    Document {
  agencyId: Types.ObjectId;
  itineraryId?: Types.ObjectId;
}

export const packageDB = mongoose.model<IPackageModel>(
  "package",
  packageSchema
);


