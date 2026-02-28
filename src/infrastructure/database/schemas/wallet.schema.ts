import { Schema, Document } from "mongoose";
import {
  IWalletEntity,
  TWalletOwnerType,
} from "../../../domain/entities/wallet.entity";

export interface IWalletModel
  extends Omit<IWalletEntity, "_id">,
    Document {}

export const walletSchema = new Schema<IWalletModel>(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    ownerType: {
      type: String,
      enum: ["USER", "AGENCY", "ADMIN"] as TWalletOwnerType[],
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

