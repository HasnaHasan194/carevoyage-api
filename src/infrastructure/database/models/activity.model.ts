import mongoose, { Document, Types } from "mongoose";
import { IActivityEntity } from "../../../domain/entities/activity.entity";
import { activitySchema } from "../schemas/activity.schema";

export interface IActivityModel
  extends Omit<IActivityEntity, "_id" | "packageId">,
    Document {
  packageId: Types.ObjectId;
}

export const activityDB = mongoose.model<IActivityModel>(
  "activity",
  activitySchema
);

