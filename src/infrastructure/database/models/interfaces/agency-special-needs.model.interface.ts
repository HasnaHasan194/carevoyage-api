import { Document, Types } from "mongoose";
import { IAgencySpecialNeedsEntity } from "../../../../domain/entities/agency-special-needs.entity";

export interface IAgencySpecialNeedsModel
  extends Omit<IAgencySpecialNeedsEntity, "_id" | "agencyId" | "specialNeedId">,
    Document {
  agencyId: Types.ObjectId;
  specialNeedId: Types.ObjectId;
}
