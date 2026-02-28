import { Schema, Document, Types } from "mongoose";
import {
  IWalletTransactionEntity,
  TWalletTransactionSource,
  TWalletTransactionType,
} from "../../../domain/entities/wallet-transaction.entity";

export interface IWalletTransactionModel
  extends Omit<IWalletTransactionEntity, "_id" | "walletId">,
    Document {
  walletId: Types.ObjectId;
}

export const walletTransactionSchema = new Schema<IWalletTransactionModel>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "wallet",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"] as TWalletTransactionType[],
      required: true,
    },
    source: {
      type: String,
      enum: ["PAYMENT", "REFUND", "COMMISSION"] as TWalletTransactionSource[],
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

walletTransactionSchema.index({ walletId: 1, createdAt: -1 });

