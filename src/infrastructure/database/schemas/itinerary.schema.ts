import { Schema, Types } from "mongoose";
import { IItineraryModel } from "../models/itinerary.model";

const mealSchema = new Schema(
  {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  { _id: false }
);

const daySchema = new Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    activities: [{ type: Types.ObjectId, ref: "activity" }],
    accommodation: { type: String, default: "" },
    meals: { type: mealSchema, required: true },
    transfers: { type: [String], default: [] },
  },
  { _id: false }
);

export const itinerarySchema = new Schema<IItineraryModel>(
  {
    packageId: {
      type: Types.ObjectId,
      ref: "package",
      required: true,
      unique: true,
      // index: true,
    },
    days: {
      type: [daySchema],
      required: true,
      validate: {
        validator: function (days: unknown[]) {
          return days.length > 0;
        },
        message: "Itinerary must have at least one day",
      },
    },
  },
  {
    timestamps: true,
  }
);

