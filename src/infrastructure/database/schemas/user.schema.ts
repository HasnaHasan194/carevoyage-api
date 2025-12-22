import mongoose from "mongoose";
import { IUserModel } from "../models/client.model";
// import { GENDER, ROLES } from "../../../shared/constants"; 

export const userSchema = new mongoose.Schema<IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      // enum: Object.values(GENDER),   // If constants exist
      default: null,
    },

    bio: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["client", "caretaker", "agency_owner", "admin"],
      required: true,
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
