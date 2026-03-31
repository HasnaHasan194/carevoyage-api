import mongoose from "mongoose";
import {
  bookingCheckoutDraftSchema,
  IBookingCheckoutDraftModel,
} from "../schemas/booking-checkout-draft.schema";

export type { IBookingCheckoutDraftModel };
export const bookingCheckoutDraftDB = mongoose.model<IBookingCheckoutDraftModel>(
  "booking_checkout_draft",
  bookingCheckoutDraftSchema
);

