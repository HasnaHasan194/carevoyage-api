import { Schema, Types } from "mongoose";
import { IAgencySpecialNeedsMasterModel } from "../models/interfaces/agency-special-needs-master.model.interface";

export const agencySpecialNeedsMasterSchema = new Schema<IAgencySpecialNeedsMasterModel>(
  {
    agencyId: {
      type: Types.ObjectId,
      ref: "agency",
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
      trim: true,
      default: null,
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

// Compound indexes for efficient queries
agencySpecialNeedsMasterSchema.index({ agencyId: 1, isDeleted: 1 });
agencySpecialNeedsMasterSchema.index({ agencyId: 1, name: 1 });
