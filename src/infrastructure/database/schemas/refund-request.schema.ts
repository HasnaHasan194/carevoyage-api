import { Schema, Document, Types } from "mongoose";
import {
  IRefundRequestEntity,
  TRefundRequestStatus,
} from "../../../domain/entities/refund-request.entity";

export interface IRefundRequestModel
  extends Omit<
      IRefundRequestEntity,
      "_id" | "bookingId" | "userId" | "agencyId"
    >,
    Document {
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  agencyId: Types.ObjectId;
}

export const refundRequestSchema = new Schema<IRefundRequestModel>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "agency",
      required: true,
      index: true,
    },
    refundAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"] as TRefundRequestStatus[],
      default: "PENDING",
      index: true,
    },
    reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

refundRequestSchema.index({ bookingId: 1 }, { unique: true });
refundRequestSchema.index({ agencyId: 1, status: 1, createdAt: -1 });

