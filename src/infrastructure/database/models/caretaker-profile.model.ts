import mongoose from "mongoose";
import { caretakerProfileSchema, ICaretakerProfileModel } from "../schemas/caretaker-profile.schema";

export const caretakerProfileDB = mongoose.model<ICaretakerProfileModel>(
  "caretaker_profiles",
  caretakerProfileSchema
);




