import type { TWalletTransactionSource, TWalletTransactionType } from "../../../domain/entities/wallet-transaction.entity";

export interface WalletTransactionResponseDTO {
  id: string;
  walletId: string;
  type: TWalletTransactionType;
  source: TWalletTransactionSource;
  referenceId: string;
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedWalletTransactionsResponseDTO {
  transactions: WalletTransactionResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminWalletOwnerType = "client" | "agency" | "admin";

export interface AdminWalletTransactionViewDTO {
  transaction: WalletTransactionResponseDTO;
  ownerType: AdminWalletOwnerType;
  ownerId: string;
  ownerName?: string;
}

export interface PaginatedAdminWalletTransactionsResponseDTO {
  transactions: AdminWalletTransactionViewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

