import mongoose, { Schema, Types } from "mongoose";
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
      type: Types.ObjectId,
      ref: "users",
      default: null,
    },
    agencyId: {
      type: Types.ObjectId,
      ref: "agencies",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
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
      default: "invited",
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

