import { Schema } from "mongoose";
import { ISpecialNeedsMasterModel } from "../models/interfaces/special-needs-master.model.interface";

export const specialNeedsMasterSchema = new Schema<ISpecialNeedsMasterModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
specialNeedsMasterSchema.index({ category: 1, isActive: 1 });
