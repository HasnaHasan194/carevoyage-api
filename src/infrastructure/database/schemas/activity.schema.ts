import { Schema, Types } from "mongoose";
import { IActivityModel } from "../models/activity.model";

export const activitySchema = new Schema<IActivityModel>(
  {
    packageId: {
      type: Types.ObjectId,
      ref: "package",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    priceIncluded: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for package-specific queries
activitySchema.index({ packageId: 1, name: 1 });
activitySchema.index({ packageId: 1, category: 1 });

