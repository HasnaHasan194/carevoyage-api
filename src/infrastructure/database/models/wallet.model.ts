import mongoose from "mongoose";
import { walletSchema, type IWalletModel } from "../schemas/wallet.schema";

export const walletDB = mongoose.model<IWalletModel>("wallet", walletSchema);

