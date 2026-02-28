import type { IWalletEntity } from "../../../../domain/entities/wallet.entity";

export interface IGetMyWalletUseCase {
  execute(userId: string, role: string): Promise<IWalletEntity>;
}

