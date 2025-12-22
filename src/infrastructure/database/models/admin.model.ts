import mongoose, { Document } from "mongoose";
import { IAdminEntity } from "../../../domain/entities/Admin.entity"
import { adminSchema } from "../schemas/admin.schema";

export interface IAdminModel
  extends Omit<IAdminEntity, "_id">,
    Document {}

export const adminDB = mongoose.model<IAdminModel>(
  "admins",
  adminSchema
);
