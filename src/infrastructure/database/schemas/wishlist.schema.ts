import mongoose, { Schema, Document, Types } from "mongoose";
import { IWishlistEntity } from "../../../domain/entities/wishlist.entity";

// Define the interface in the schema file (like caretaker-profile does)
export interface IWishlistModel
  extends Omit<IWishlistEntity, "_id" | "userId" | "packageId">,
    Document {
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
}

export const wishlistSchema = new Schema<IWishlistModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "package",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicates
wishlistSchema.index({ userId: 1, packageId: 1 }, { unique: true });
