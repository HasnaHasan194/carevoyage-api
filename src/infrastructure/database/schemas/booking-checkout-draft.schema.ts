import { Schema, Document, Types } from "mongoose";
import {
  IBookingCheckoutDraftEntity,
  TBookingCheckoutDraftStatus,
} from "../../../domain/entities/booking-checkout-draft.entity";

export interface IBookingCheckoutDraftModel
  extends Omit<
      IBookingCheckoutDraftEntity,
      "_id" | "clientId" | "packageId" | "agencyId" | "caretakerId"
    >,
    Document {
  clientId: Types.ObjectId;
  packageId: Types.ObjectId;
  agencyId: Types.ObjectId;
  caretakerId?: Types.ObjectId | null;
}

export const bookingCheckoutDraftSchema =
  new Schema<IBookingCheckoutDraftModel>(
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
      endDate: { type: Date, required: true },
      basePrice: { type: Number, required: true, min: 0 },
      caretakerFee: { type: Number, required: true, default: 0, min: 0 },
      specialNeedsFee: { type: Number, required: true, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: "inr" },
      caretakerId: {
        type: Schema.Types.ObjectId,
        ref: "caretaker_profile",
        default: null,
      },
      selectedSpecialNeedIds: { type: [Schema.Types.ObjectId], default: [] },
      stripeSessionId: { type: String, default: null, index: true },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "EXPIRED"] as TBookingCheckoutDraftStatus[],
        required: true,
        default: "PENDING",
        index: true,
      },
      expiresAt: { type: Date, required: true, index: true },
    },
    { timestamps: true }
  );

// TTL cleanup for abandoned drafts.
bookingCheckoutDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

