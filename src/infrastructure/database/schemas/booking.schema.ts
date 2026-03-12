import { Schema, Document, Types } from "mongoose";
import { IBookingEntity, TBookingStatus } from "../../../domain/entities/booking.entity";

export interface IBookingModel
  extends Omit<IBookingEntity, "_id" | "clientId" | "packageId" | "agencyId">,
    Document {
  clientId: Types.ObjectId;
  packageId: Types.ObjectId;
  agencyId: Types.ObjectId;
}

export const bookingSchema = new Schema<IBookingModel>(
  {
    clientId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    packageId: {
      type: Types.ObjectId,
      ref: "package",
      required: true,
      index: true,
    },
    agencyId: {
      type: Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    caretakerFee: { type: Number, required: true, default: 0, min: 0 },
    specialNeedsFee: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "inr" },
    status: {
      type: String,
      enum: [
        "pending_payment",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED_BY_USER",
        "REFUNDED",
      ] as TBookingStatus[],
      default: "pending_payment",
      index: true,
    },
    stripeSessionId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    cancellationReason: { type: String, default: null },
    caretakerId: { type: Schema.Types.ObjectId, ref: "caretaker_profile", default: null },
    selectedSpecialNeedIds: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

bookingSchema.index({ stripeSessionId: 1 });
