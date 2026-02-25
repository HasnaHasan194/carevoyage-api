import mongoose, { Schema } from "mongoose";
import { ICaretakerProfileEntity } from "../../../domain/entities/caretaker-profile.entity";

export interface ICaretakerProfileModel
  extends Omit<ICaretakerProfileEntity, "_id">,
    mongoose.Document {}

const addressSchema = new Schema(
  {
    street: { type: String, required: false, default: null },
    city: { type: String, required: false, default: null },
    state: { type: String, required: false, default: null },
    postalCode: { type: String, required: false, default: null },
    country: { type: String, required: false, default: null },
  },
  { _id: false }
);

export const caretakerProfileSchema = new Schema<ICaretakerProfileModel>(
  {
    userId: {
      type: String,
      ref: "users",
      default: null, 
    },
    agencyId: {
      type: String,
      ref: "agencies",
      required: true,
    },
    email: {
      type: String,
      required: false, 
      lowercase: true,
      trim: true,
      default: null,
    },
   
    nationality: {
      type: String,
      required: false,
      default: null,
    },
    alternatePhone: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    languages: {
      type: [String],
      required: true,
      default: [],
    },
    experienceYears: {
      type: Number,
      required: true,
      default: 0,
    },
    profileImage: {
      type: String,
      default: null,
    },
    documents: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["invited", "active", "blocked"],
      required: true,
      default: "invited", // Onboarding / account status (not availability)
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: null, // Changed from "pending" - only set when verification submitted
      index: true,
    },
    kycDocs: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "INACTIVE"],
      required: true,
      default: "INACTIVE",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    pricePerDay: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedAt: {
      type: Date,
      default: null,
    },
    address: {
      type: addressSchema,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

