import type { TWalletOwnerType } from "../../../../domain/entities/wallet.entity";
import type { TWalletTransactionSource } from "../../../../domain/entities/wallet-transaction.entity";

export interface CreditWalletParams {
  ownerId: string;
  ownerType: TWalletOwnerType;
  amount: number;
  source: TWalletTransactionSource;
  referenceId: string;
  description?: string;
}

export interface ICreditWalletUseCase {
  execute(params: CreditWalletParams, session?: unknown): Promise<void>;
}
