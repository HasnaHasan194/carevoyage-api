import { Document, Types } from "mongoose";
import { IAgencySpecialNeedsMasterEntity } from "../../../../domain/entities/agency-special-needs-master.entity";

export interface IAgencySpecialNeedsMasterModel
  extends Omit<IAgencySpecialNeedsMasterEntity, "_id" | "agencyId">,
    Document {
  agencyId: Types.ObjectId;
}
