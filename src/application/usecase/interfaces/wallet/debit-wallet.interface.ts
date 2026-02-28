import type { TWalletOwnerType } from "../../../../domain/entities/wallet.entity";
import type { TWalletTransactionSource } from "../../../../domain/entities/wallet-transaction.entity";

export interface DebitWalletParams {
  ownerId: string;
  ownerType: TWalletOwnerType;
  amount: number;
  source: TWalletTransactionSource;
  referenceId: string;
  description?: string;
}

export interface IDebitWalletUseCase {
  execute(params: DebitWalletParams, session?: unknown): Promise<void>;
}
