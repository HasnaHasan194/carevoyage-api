import mongoose from "mongoose";
import { agencySpecialNeedsMasterSchema } from "../schemas/agency-special-needs-master.schema";
import { IAgencySpecialNeedsMasterModel } from "./interfaces/agency-special-needs-master.model.interface";

export const agencySpecialNeedsMasterDB = mongoose.model<IAgencySpecialNeedsMasterModel>(
  "agency_special_needs_master",
  agencySpecialNeedsMasterSchema
);
