import type { TWalletTransactionSortOrder } from "../../../../domain/entities/wallet-transaction.entity";
import type { PaginatedWalletTransactionsResponseDTO } from "../../../dto/response/wallet-response.dto";

/** "all" means no type filter; CREDIT or DEBIT filter by transaction type. */
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

