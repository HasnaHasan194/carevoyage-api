import { Document, Types } from "mongoose";
import { ICategoryEntity } from "../../../../domain/entities/category.entity";

export interface ICategoryModel
  extends Omit<ICategoryEntity, "_id" | "agencyId">,
    Document {
  agencyId: Types.ObjectId;
}
