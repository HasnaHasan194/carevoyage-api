import mongoose from "mongoose";
import {
  walletTransactionSchema,
  type IWalletTransactionModel,
} from "../schemas/wallet-transaction.schema";

export const walletTransactionDB = mongoose.model<IWalletTransactionModel>(
  "wallet_transaction",
  walletTransactionSchema
);

