import type { TWalletTransactionSortOrder } from "../../../../domain/entities/wallet-transaction.entity";
import type { PaginatedWalletTransactionsResponseDTO } from "../../../dto/response/wallet-response.dto";


export type WalletTransactionTypeFilter = "all" | "CREDIT" | "DEBIT";

export interface GetMyWalletTransactionsParams {
  userId: string;
  role: string;
  page: number;
  limit: number;
  type?: WalletTransactionTypeFilter;
  sort?: TWalletTransactionSortOrder;
}

export interface IGetMyWalletTransactionsUseCase {
  execute(params: GetMyWalletTransactionsParams): Promise<PaginatedWalletTransactionsResponseDTO>;
}

