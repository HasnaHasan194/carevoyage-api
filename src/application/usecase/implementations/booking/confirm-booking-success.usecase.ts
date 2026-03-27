import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IDBSession } from "../../../../infrastructure/interface/session.interface";
import { IConfirmBookingSuccessUseCase } from "../../interfaces/booking/confirm-booking-success.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class ConfirmBookingSuccessUseCase implements IConfirmBookingSuccessUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IDBSession")
    private _dbSession: IDBSession,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(sessionId: string): Promise<void> {
    const booking = await this._bookingRepository.findByStripeSessionId(sessionId);
    if (!booking) return;
    if (booking.status !== "pending_payment") return;

    await this._dbSession.withTransaction(async () => {
      const session = this._dbSession.getSession();

      await this._bookingRepository.updateById(
        booking._id,
        {
          status: "CONFIRMED",
          paidAt: new Date(),
        },
        session
      );

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
        },
        session
      );
    });

    await this._chatConversationProvisioner.provisionForBooking({
      ...booking,
      status: "CONFIRMED",
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
        metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
      });
    }

    await this._notificationService.createAndPublish({
      recipientUserId: booking.clientId,
      recipientRole: "client",
      type: "BOOKING_CONFIRMED",
      title: "Booking confirmed",
      message: "Your booking payment was successful and the booking is confirmed.",
      link: `/client/bookings/${booking._id}`,
      metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
    });

    if (booking.caretakerId) {
      const caretakerProfile = await this._caretakerProfileRepository.findById(
        booking.caretakerId
      );
      if (caretakerProfile?.userId) {
        await this._notificationService.createAndPublish({
          recipientUserId: caretakerProfile.userId,
          recipientRole: "caretaker",
          type: "BOOKING_CONFIRMED",
          title: "New trip assigned",
          message: "A booking you are assigned to has been confirmed.",
          link: "/caretaker/trips",
          metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
        });
      }
    }
  }
}
