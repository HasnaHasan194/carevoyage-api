import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { type ICancelClientBookingUseCase } from "../../interfaces/booking/cancel-client-booking.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants/constants";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";


@injectable()
export class CancelClientBookingUseCase implements ICancelClientBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,

    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,

  
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

    if (booking.caretakerId) {
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "AVAILABLE",
      );
    }
  }
}
