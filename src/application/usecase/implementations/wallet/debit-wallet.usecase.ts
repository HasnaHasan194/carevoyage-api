import { ClientSession } from "mongoose";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import type { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import type {
  IDebitWalletUseCase,
  DebitWalletParams,
} from "../../interfaces/wallet/debit-wallet.interface";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class DebitWalletUseCase implements IDebitWalletUseCase {
  constructor(
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
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

    const caretakerProfile =
      params.ownerType === "USER"
        ? await this._caretakerProfileRepository.findByUserId(params.ownerId)
        : null;

    const recipientUserId =
      params.ownerType === "AGENCY"
        ? (await this._agencyRepository.findById(params.ownerId))?.userId
        : params.ownerId;

    if (recipientUserId) {
      const recipientRole =
        params.ownerType === "USER"
          ? (caretakerProfile ? ("caretaker" as const) : ("client" as const))
          : params.ownerType === "AGENCY"
            ? ("agency_owner" as const)
            : ("admin" as const);

      await this._notificationService.createAndPublish({
        recipientUserId,
        recipientRole,
        type: "WALLET_DEBITED",
        title: "Wallet debited",
        message: params.description?.trim()
          ? params.description.trim()
          : `Your wallet was debited by ${params.amount}.`,
        link:
          recipientRole === "agency_owner"
            ? "/agency/wallet"
            : recipientRole === "admin"
              ? "/admin/wallet-transactions"
              : recipientRole === "caretaker"
                ? "/caretaker/trips"
                : "/client/wallet",
        metadata: {
          type: "WALLET_DEBITED",
          walletId: wallet._id,
          amount: params.amount,
          source: params.source,
          referenceId: params.referenceId,
        },
      });
    }
  }
}
