import type { TWalletOwnerType } from "../../../../domain/entities/wallet.entity";

export interface WalletOwnerResult {
  ownerId: string;
  ownerType: TWalletOwnerType;
}

export interface IWalletOwnerResolver {
  resolve(userId: string, role: string): Promise<WalletOwnerResult | null>;
}
