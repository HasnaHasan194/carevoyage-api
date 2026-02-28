import type { TWalletOwnerType } from "../../../../domain/entities/wallet.entity";
import type { AdminWalletOwnerType } from "../../../dto/response/wallet-response.dto";

export interface WalletOwnerDisplayResult {
  ownerType: AdminWalletOwnerType;
  ownerName?: string;
}

export interface IWalletOwnerDisplayService {
  getDisplay(ownerId: string, ownerType: TWalletOwnerType): Promise<WalletOwnerDisplayResult>;
}
