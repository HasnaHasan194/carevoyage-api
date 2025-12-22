import mongoose, { Schema, Types } from "mongoose";
import {
  IAgencyEntity,
  TVerificationStatus,
} from "../../../domain/entities/Agency.entity";
import { IAgencyModel } from "../models/agency.model";

export const agencySchema = new Schema<IAgencyModel>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    agencyName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    kycDocs: {
      type: [String],
      required: true,
      default: [],
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"] as TVerificationStatus[],
      default: "pending",
    },

    description: {
      type: String,
      default: null,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


