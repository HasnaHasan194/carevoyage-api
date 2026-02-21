import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IHandleStripeWebhookUsecase } from "../../interfaces/payment/handle-stripe-webhook-usecase.interface";

@injectable()
export class HandleStripeWebhookUsecase implements IHandleStripeWebhookUsecase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
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
      status: "paid",
      paidAt: new Date(),
    });
  }
}
