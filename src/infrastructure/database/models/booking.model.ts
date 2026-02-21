import mongoose from "mongoose";
import { bookingSchema, IBookingModel } from "../schemas/booking.schema";

export type { IBookingModel };
export const bookingDB = mongoose.model<IBookingModel>(
  "booking",
  bookingSchema
);
