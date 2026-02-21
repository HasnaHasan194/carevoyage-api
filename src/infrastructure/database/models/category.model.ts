import mongoose from "mongoose";
import { categorySchema } from "../schemas/category.schema";
import { ICategoryModel } from "./interfaces/category.model.interface";

export const categoryDB = mongoose.model<ICategoryModel>("category", categorySchema);
