import { Schema, Types } from "mongoose";
import { ICategoryModel } from "../models/interfaces/category.model.interface";

export const categorySchema = new Schema<ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    agencyId: {
      type: Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
categorySchema.index({ agencyId: 1, isDeleted: 1 });
categorySchema.index({ agencyId: 1, name: 1 });
