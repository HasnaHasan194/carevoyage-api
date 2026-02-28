import { ClientSession } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type {
  ICreditWalletUseCase,
  CreditWalletParams,
} from "../../interfaces/wallet/credit-wallet.interface";

@injectable()
export class CreditWalletUseCase implements ICreditWalletUseCase {
  constructor(
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async execute(
    params: CreditWalletParams,
    session?: unknown
  ): Promise<void> {
    const clientSession = session as ClientSession | undefined;
    const now = new Date();

    let wallet =
      (await this._walletRepository.findByOwner(
        params.ownerId,
        params.ownerType,
        clientSession
      )) ?? null;

    if (!wallet) {
      wallet = await this._walletRepository.save(
        {
          ownerId: params.ownerId,
          ownerType: params.ownerType,
          balance: 0,
          createdAt: now,
          updatedAt: now,
        },
        clientSession
      );
    }

    const newBalance = wallet.balance + params.amount;
    await this._walletRepository.updateById(
      wallet._id,
      { balance: newBalance, updatedAt: now },
      clientSession
    );

    await this._walletTransactionRepository.save(
      {
        walletId: wallet._id,
        type: "CREDIT",
        source: params.source,
        referenceId: params.referenceId,
        amount: params.amount,
        description: params.description,
        createdAt: now,
        updatedAt: now,
      },
      clientSession
    );
  }
}
