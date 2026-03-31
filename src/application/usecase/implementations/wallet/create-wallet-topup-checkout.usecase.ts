import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { config } from "../../../../shared/config";
import type { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import type {
  CreateWalletTopupCheckoutResult,
  ICreateWalletTopupCheckoutUseCase,
} from "../../interfaces/wallet/create-wallet-topup-checkout.interface";

@injectable()
export class CreateWalletTopupCheckoutUseCase
  implements ICreateWalletTopupCheckoutUseCase
{
  constructor(
    @inject("IPaymentService")
    private readonly _paymentService: IPaymentService
  ) {}

  async execute(
    userId: string,
    amount: number
  ): Promise<CreateWalletTopupCheckoutResult> {
    if (!amount || typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new ValidationError(ERROR_MESSAGE.WALLET.INVALID_AMOUNT);
    }

    const roundedAmount = Math.round(amount);
    if (roundedAmount <= 0) {
      throw new ValidationError(ERROR_MESSAGE.WALLET.INVALID_AMOUNT);
    }

    const baseUrl = config.client.URI || "http://localhost:5173";
    const successUrl = `${baseUrl}/client/wallet?topup=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/client/wallet?topup=cancel`;

    return this._paymentService.createCheckoutSession(
      roundedAmount,
      "inr",
      successUrl,
      cancelUrl,
      {
        walletTopupOwnerId: userId,
        walletTopupOwnerType: "USER",
      },
      {
        name: "Wallet top-up",
        description: "Add money to your CareVoyage wallet",
      }
    );
  }
}

