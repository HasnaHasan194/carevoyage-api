import mongoose, { Document, Types } from "mongoose";
import { IItineraryEntity } from "../../../domain/entities/itinerary.entity";
import { itinerarySchema } from "../schemas/itinerary.schema";

export interface IItineraryModel
  extends Omit<IItineraryEntity, "_id" | "packageId">,
    Document {
  packageId: Types.ObjectId;
}

export const itineraryDB = mongoose.model<IItineraryModel>(
  "itinerary",
  itinerarySchema
);


