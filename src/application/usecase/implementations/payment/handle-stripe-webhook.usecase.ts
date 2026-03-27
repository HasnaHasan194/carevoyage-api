import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IHandleStripeWebhookUsecase } from "../../interfaces/payment/handle-stripe-webhook-usecase.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class HandleStripeWebhookUsecase implements IHandleStripeWebhookUsecase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase,
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
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) return;

    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking || booking.status !== "pending_payment") return;

    await this._bookingRepository.updateById(bookingId, {
      status: "CONFIRMED",
      paidAt: new Date(),
    });

    const agency = await this._agencyRepository.findById(booking.agencyId);
    if (agency) {
      await this._notificationService.createAndPublish({
        recipientUserId: agency.userId,
        recipientRole: "agency_owner",
        type: "BOOKING_CONFIRMED",
        title: "New booking confirmed",
        message: "A booking has been confirmed and paid.",
        link: "/agency/packages",
        metadata: { type: "BOOKING_CONFIRMED", bookingId },
      });
    }

    await this._notificationService.createAndPublish({
      recipientUserId: booking.clientId,
      recipientRole: "client",
      type: "BOOKING_CONFIRMED",
      title: "Booking confirmed",
      message: "Your booking payment was successful and the booking is confirmed.",
      link: `/client/bookings/${bookingId}`,
      metadata: { type: "BOOKING_CONFIRMED", bookingId },
    });

    if (booking.caretakerId) {
      const caretakerProfile = await this._caretakerProfileRepository.findById(
        booking.caretakerId
      );
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "BUSY"
      );
      if (caretakerProfile?.userId) {
        await this._notificationService.createAndPublish({
          recipientUserId: caretakerProfile.userId,
          recipientRole: "caretaker",
          type: "BOOKING_CONFIRMED",
          title: "New trip assigned",
          message: "A booking you’re assigned to is confirmed.",
          link: "/caretaker/trips",
          metadata: { type: "BOOKING_CONFIRMED", bookingId },
        });
      }
    }

    await this._creditBookingPayoutUseCase.execute(
      {
        bookingId: booking._id,
        agencyId: booking.agencyId,
        totalAmount: booking.totalAmount,
      }
    );

    await this._chatConversationProvisioner.provisionForBooking({
      ...booking,
      status: "CONFIRMED",
    });
  }
}
