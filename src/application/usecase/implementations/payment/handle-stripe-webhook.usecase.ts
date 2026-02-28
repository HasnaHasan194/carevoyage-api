import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IHandleStripeWebhookUsecase } from "../../interfaces/payment/handle-stripe-webhook-usecase.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";

@injectable()
export class HandleStripeWebhookUsecase implements IHandleStripeWebhookUsecase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase
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
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) return;

    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking || booking.status !== "pending_payment") return;

    await this._bookingRepository.updateById(bookingId, {
      status: "CONFIRMED",
      paidAt: new Date(),
    });

    if (booking.caretakerId) {
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "BUSY"
      );
    }

    await this._creditBookingPayoutUseCase.execute(
      {
        bookingId: booking._id,
        agencyId: booking.agencyId,
        totalAmount: booking.totalAmount,
      }
    );
  }
}
