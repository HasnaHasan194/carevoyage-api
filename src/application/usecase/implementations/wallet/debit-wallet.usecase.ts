import { ClientSession } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import type {
  IDebitWalletUseCase,
  DebitWalletParams,
} from "../../interfaces/wallet/debit-wallet.interface";

@injectable()
export class DebitWalletUseCase implements IDebitWalletUseCase {
  constructor(
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async execute(
    params: DebitWalletParams,
    session?: unknown
  ): Promise<void> {
    const clientSession = session as ClientSession | undefined;
    const now = new Date();

    const wallet = await this._walletRepository.findByOwner(
      params.ownerId,
      params.ownerType,
      clientSession
    );

    if (!wallet) {
      throw new ValidationError(ERROR_MESSAGE.WALLET.INSUFFICIENT_BALANCE);
    }

    if (wallet.balance < params.amount) {
      throw new ValidationError(ERROR_MESSAGE.WALLET.INSUFFICIENT_BALANCE);
    }

    const newBalance = wallet.balance - params.amount;
    await this._walletRepository.updateById(
      wallet._id,
      { balance: newBalance, updatedAt: now },
      clientSession
    );

    await this._walletTransactionRepository.save(
      {
        walletId: wallet._id,
        type: "DEBIT",
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
