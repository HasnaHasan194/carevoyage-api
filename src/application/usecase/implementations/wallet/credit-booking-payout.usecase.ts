import { inject, injectable } from "tsyringe";
import { config } from "../../../../shared/config";
import { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type {
  ICreditBookingPayoutUseCase,
  CreditBookingPayoutParams,
} from "../../interfaces/wallet/credit-booking-payout.interface";
import type { ICreditWalletUseCase } from "../../interfaces/wallet/credit-wallet.interface";

@injectable()
export class CreditBookingPayoutUseCase implements ICreditBookingPayoutUseCase {
  constructor(
    @inject("ICreditWalletUseCase")
    private readonly _creditWalletUseCase: ICreditWalletUseCase,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async execute(
    params: CreditBookingPayoutParams,
    session?: unknown
  ): Promise<void> {
    const alreadyCredited = await this._walletTransactionRepository.existsByReferenceIdAndSource(
      params.bookingId,
      "PAYMENT"
    );
    if (alreadyCredited) return;

    const agencyShare = config.wallet.BOOKING_AGENCY_SHARE;
    const adminShare = config.wallet.BOOKING_ADMIN_SHARE;
    const agencyAmount = Math.round(params.totalAmount * agencyShare);
    const adminAmount = Math.round(params.totalAmount * adminShare);

    await this._creditWalletUseCase.execute(
      {
        ownerId: params.agencyId,
        ownerType: "AGENCY",
        amount: agencyAmount,
        source: "PAYMENT",
        referenceId: params.bookingId,
        description: `Booking payout (${Math.round(agencyShare * 100)}% of booking ${params.bookingId})`,
      },
      session
    );

    await this._creditWalletUseCase.execute(
      {
        ownerId: config.wallet.ADMIN_WALLET_OWNER_ID,
        ownerType: "ADMIN",
        amount: adminAmount,
        source: "COMMISSION",
        referenceId: params.bookingId,
        description: `Platform commission (${Math.round(adminShare * 100)}% of booking ${params.bookingId})`,
      },
      session
    );
  }
}
