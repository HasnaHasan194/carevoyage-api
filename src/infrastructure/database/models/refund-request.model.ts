import mongoose from "mongoose";
import {
  refundRequestSchema,
  type IRefundRequestModel,
} from "../schemas/refund-request.schema";

export const refundRequestDB = mongoose.model<IRefundRequestModel>(
  "refund_request",
  refundRequestSchema
);

