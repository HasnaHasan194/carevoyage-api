import { Schema, Types } from "mongoose";
import { IPackageModel } from "../models/package.model";
import { TPackageStatus } from "../../../domain/entities/package.entity";

export const packageSchema = new Schema<IPackageModel>(
  {
    agencyId: {
      type: Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    PackageName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published", "completed", "cancelled"] as TPackageStatus[],
      default: "draft",
      index: true,
    },
    meetingPoint: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    maxGroupSize: {
      type: Number,
      required: true,
      min: 1,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IPackageModel, value: Date) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    itineraryId: {
      type: Types.ObjectId,
      ref: "itinerary",
      default: null,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
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

// Indexes
packageSchema.index({ agencyId: 1, status: 1 });
packageSchema.index({ status: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ basePrice: 1 });
packageSchema.index({ startDate: 1, endDate: 1 });
packageSchema.index({ PackageName: "text", category: "text", tags: "text" });

