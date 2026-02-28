export type TWalletTransactionType = "CREDIT" | "DEBIT";

export type TWalletTransactionSource = "PAYMENT" | "REFUND" | "COMMISSION";

/** Sort order for transaction list: newest first (createdAt desc) or oldest first (createdAt asc). */
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

