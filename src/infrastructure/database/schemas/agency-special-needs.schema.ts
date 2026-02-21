import { Schema, Types } from "mongoose";
import { IAgencySpecialNeedsModel } from "../models/interfaces/agency-special-needs.model.interface";

export const agencySpecialNeedsSchema = new Schema<IAgencySpecialNeedsModel>(
  {
    agencyId: {
      type: Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    specialNeedId: {
      type: Types.ObjectId,
      ref: "agency_special_needs_master",
      required: true,
      index: true,
    },
    unit: {
      type: String,
      enum: ["per_day", "per_trip"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Compound unique index to prevent duplicates per agency + specialNeedId
agencySpecialNeedsSchema.index(
  { agencyId: 1, specialNeedId: 1 },
  { unique: true }
);

// Compound indexes for efficient queries
agencySpecialNeedsSchema.index({ agencyId: 1, isDeleted: 1 });
agencySpecialNeedsSchema.index({ agencyId: 1, isActive: 1 });
agencySpecialNeedsSchema.index({ agencyId: 1, specialNeedId: 1, isDeleted: 1 });
