import {
  IWalletTransactionEntity,
  TWalletTransactionSortOrder,
  TWalletTransactionType,
} from "../../entities/wallet-transaction.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWalletTransactionRepository
  extends IBaseRepository<IWalletTransactionEntity> {
  findByWalletId(walletId: string): Promise<IWalletTransactionEntity[]>;

  findByWalletIdPaginated(
    walletId: string,
    page: number,
    limit: number,
    type?: TWalletTransactionType,
    sortOrder?: TWalletTransactionSortOrder
  ): Promise<IWalletTransactionEntity[]>;

  countByWalletId(
    walletId: string,
    type?: TWalletTransactionType
  ): Promise<number>;

  findAllSortedByDate(): Promise<IWalletTransactionEntity[]>;

  findAllPaginated(
    page: number,
    limit: number,
    type?: IWalletTransactionEntity["type"],
    source?: IWalletTransactionEntity["source"],
    sortOrder?: TWalletTransactionSortOrder
  ): Promise<IWalletTransactionEntity[]>;

  countAll(
    type?: IWalletTransactionEntity["type"],
    source?: IWalletTransactionEntity["source"]
  ): Promise<number>;

 
  existsByReferenceIdAndSource(
    referenceId: string,
    source: IWalletTransactionEntity["source"]
  ): Promise<boolean>;
}

