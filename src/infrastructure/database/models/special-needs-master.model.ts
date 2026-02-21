import mongoose from "mongoose";
import { specialNeedsMasterSchema } from "../schemas/special-needs-master.schema";
import { ISpecialNeedsMasterModel } from "./interfaces/special-needs-master.model.interface";

export const specialNeedsMasterDB = mongoose.model<ISpecialNeedsMasterModel>(
  "special_needs_master",
  specialNeedsMasterSchema
);
