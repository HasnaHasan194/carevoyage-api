import type {
  PaginatedAdminWalletTransactionsResponseDTO,
} from "../../../dto/response/wallet-response.dto";
import type {
  TWalletTransactionSortOrder,
  TWalletTransactionSource,
  TWalletTransactionType,
} from "../../../../domain/entities/wallet-transaction.entity";

export interface ListWalletTransactionsParams {
  page: number;
  limit: number;
  type?: TWalletTransactionType;
  source?: TWalletTransactionSource;
  sort?: TWalletTransactionSortOrder;
}

export interface IListWalletTransactionsUseCase {
  execute(params: ListWalletTransactionsParams): Promise<PaginatedAdminWalletTransactionsResponseDTO>;
}

