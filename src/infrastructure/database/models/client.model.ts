import mongoose, { Document} from "mongoose";
import { IUserEntity } from  "../../../domain/entities/user.entity"
import { userSchema } from "../schemas/user.schema";

export interface IUserModel extends Omit<IUserEntity, "_id">, Document {
  
}

export const userDB = mongoose.model<IUserModel>("users", userSchema);
