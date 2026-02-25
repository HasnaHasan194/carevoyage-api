import { Schema, Document, Types } from "mongoose";
import {
  ICaretakerRequestEntity,
  TCaretakerRequestStatus,
} from "../../../domain/entities/caretaker-request.entity";

export interface ICaretakerRequestModel
  extends Omit<
      ICaretakerRequestEntity,
      | "_id"
      | "clientId"
      | "packageId"
      | "agencyId"
      | "fulfilledByCaretakerId"
    >,
    Document {
  clientId: Types.ObjectId;
  packageId: Types.ObjectId;
  agencyId: Types.ObjectId;
  fulfilledByCaretakerId?: Types.ObjectId;
}

export const caretakerRequestSchema = new Schema<ICaretakerRequestModel>(
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
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"] as TCaretakerRequestStatus[],
      default: "pending",
      index: true,
    },
    requestedAt: { type: Date, required: true, default: Date.now },
    fulfilledAt: { type: Date, default: null },
    fulfilledByCaretakerId: {
      type: Schema.Types.ObjectId,
      ref: "caretaker_profile",
      default: null,
    },
    agencyNoteToClient: { type: String, default: null },
  },
  { timestamps: true }
);

caretakerRequestSchema.index({ clientId: 1, packageId: 1, status: 1 });
caretakerRequestSchema.index({ agencyId: 1, status: 1 });
