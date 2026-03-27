import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { type ICancelClientBookingUseCase } from "../../interfaces/booking/cancel-client-booking.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { NotificationService } from "../../../services/notification/notification.service";


@injectable()
export class CancelClientBookingUseCase implements ICancelClientBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,

    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,

    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,

    @inject(NotificationService)
    private readonly _notificationService: NotificationService,
  ) {}

  async execute(
    clientId: string,
    bookingId: string,
    reason?: string
  ): Promise<void> {
    const booking = await this._bookingRepository.findByIdAndClientId(
      bookingId,
      clientId,
    );

  
  
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    if (booking.status !== "CONFIRMED") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.CANNOT_CANCEL);
    }

    await this._bookingRepository.updateById(bookingId, {
      status: "CANCELLED_BY_USER",
      cancellationReason: reason?.trim() || undefined,
    });

    await this._chatConversationProvisioner.syncChatEnabledForBooking(
      bookingId,
      "CANCELLED_BY_USER"
    );

    const agency = await this._agencyRepository.findById(booking.agencyId);
    if (agency) {
      await this._notificationService.createAndPublish({
        recipientUserId: agency.userId,
        recipientRole: "agency_owner",
        type: "BOOKING_CANCELLED",
        title: "Booking cancelled",
        message: "A client cancelled a booking.",
        link: "/agency/packages/bookings",
        metadata: { type: "BOOKING_CANCELLED", bookingId, cancelledBy: "client" },
      });
    }

    if (booking.caretakerId) {
      const caretakerProfile = await this._caretakerProfileRepository.findById(
        booking.caretakerId
      );
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "AVAILABLE",
      );
      if (caretakerProfile?.userId) {
        await this._notificationService.createAndPublish({
          recipientUserId: caretakerProfile.userId,
          recipientRole: "caretaker",
          type: "BOOKING_CANCELLED",
          title: "Trip cancelled",
          message: "A booking assigned to you was cancelled.",
          link: "/caretaker/trips",
          metadata: { type: "BOOKING_CANCELLED", bookingId, cancelledBy: "client" },
        });
      }
    }

    await this._notificationService.createAndPublish({
      recipientUserId: booking.clientId,
      recipientRole: "client",
      type: "BOOKING_CANCELLED",
      title: "Booking cancelled",
      message: "Your booking has been cancelled.",
      link: "/client/bookings",
      metadata: { type: "BOOKING_CANCELLED", bookingId, cancelledBy: "client" },
    });
  }
}
