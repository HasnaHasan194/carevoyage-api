export type TWalletTransactionType = "CREDIT" | "DEBIT";

export type TWalletTransactionSource = "PAYMENT" | "REFUND" | "COMMISSION";

export type TWalletTransactionSortOrder = "newest" | "oldest";

export interface IWalletTransactionEntity {
  _id: string;
  walletId: string;
  type: TWalletTransactionType;
  source: TWalletTransactionSource;
  referenceId: string;
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

