import mongoose from "mongoose";
import {
  caretakerRequestSchema,
  ICaretakerRequestModel,
} from "../schemas/caretaker-request.schema";

export type { ICaretakerRequestModel };
export const caretakerRequestDB = mongoose.model<ICaretakerRequestModel>(
  "caretaker_request",
  caretakerRequestSchema
);
