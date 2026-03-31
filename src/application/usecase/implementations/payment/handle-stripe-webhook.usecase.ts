import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IBookingCheckoutDraftRepository } from "../../../../domain/repositoryInterfaces/BookingCheckoutDraft/booking-checkout-draft.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IHandleStripeWebhookUsecase } from "../../interfaces/payment/handle-stripe-webhook-usecase.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";
import type { ICreditWalletUseCase } from "../../interfaces/wallet/credit-wallet.interface";
import type { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { NotificationService } from "../../../services/notification/notification.service";
import { finalizeBookingFromCheckoutDraft } from "../../../services/booking/booking-checkout-finalizer";
import type { IDBSession } from "../../../../infrastructure/interface/session.interface";

@injectable()
export class HandleStripeWebhookUsecase implements IHandleStripeWebhookUsecase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IBookingCheckoutDraftRepository")
    private _bookingCheckoutDraftRepository: IBookingCheckoutDraftRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IDBSession")
    private _dbSession: IDBSession,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase,
    @inject("ICreditWalletUseCase")
    private readonly _creditWalletUseCase: ICreditWalletUseCase,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(
    payload: Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<void> {
    const event = await this._paymentService.verifyWebhookSignature(
      payload,
      signature,
      endpointSecret
    );

    if (event.type !== "checkout.session.completed") {
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const checkoutDraftId = session.metadata?.checkoutDraftId;
    const walletTopupOwnerId = session.metadata?.walletTopupOwnerId;
    const walletTopupOwnerType = session.metadata?.walletTopupOwnerType;

    if (checkoutDraftId) {
      await finalizeBookingFromCheckoutDraft({
        checkoutDraftId,
        stripeSessionId: session.id,
        bookingCheckoutDraftRepository: this._bookingCheckoutDraftRepository,
        bookingRepository: this._bookingRepository,
        caretakerProfileRepository: this._caretakerProfileRepository,
        agencyRepository: this._agencyRepository,
        dbSession: this._dbSession,
        creditBookingPayoutUseCase: this._creditBookingPayoutUseCase,
        chatConversationProvisioner: this._chatConversationProvisioner,
        notificationService: this._notificationService,
      });
      return;
    }

    // Wallet top-up flow (additive). Only triggers when metadata is present.
    if (walletTopupOwnerId && walletTopupOwnerType === "USER") {
      if (session.payment_status !== "paid") return;

      const amountTotal = session.amount_total ?? 0;
      const amount = Math.round(amountTotal / 100);
      if (amount <= 0) return;

      const referenceId = `TOPUP:${session.id}`;
      const alreadyCredited =
        await this._walletTransactionRepository.existsByReferenceIdAndSource(
          referenceId,
          "PAYMENT"
        );
      if (alreadyCredited) return;

      await this._creditWalletUseCase.execute({
        ownerId: walletTopupOwnerId,
        ownerType: "USER",
        amount,
        source: "PAYMENT",
        referenceId,
        description: "Wallet top-up",
      });
    }
  }
}
