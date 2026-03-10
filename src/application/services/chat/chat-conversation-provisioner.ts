import { inject, injectable } from "tsyringe";
import type { IBookingEntity } from "../../../domain/entities/booking.entity";
import type { IChatRepository } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";

export interface IChatConversationProvisioner {
  provisionForBooking(booking: IBookingEntity): Promise<void>;
  syncChatEnabledForBooking(bookingId: string, status: string): Promise<void>;
}

@injectable()
export class ChatConversationProvisioner implements IChatConversationProvisioner {
  constructor(
    @inject("IChatRepository")
    private readonly _chatRepository: IChatRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository
  ) {}

  async provisionForBooking(booking: IBookingEntity): Promise<void> {
    if (!booking.caretakerId) return;

    const caretakerProfile = await this._caretakerProfileRepository.findById(
      booking.caretakerId
    );
    const caretakerUserId = caretakerProfile?.userId;
    if (!caretakerUserId) return;

    const chatEnabled = booking.status === "CONFIRMED";

    await this._chatRepository.upsertConversationByBookingId({
      bookingId: booking._id,
      participants: {
        clientUserId: booking.clientId,
        caretakerUserId,
      },
      chatEnabled,
    });
  }

  async syncChatEnabledForBooking(
    bookingId: string,
    status: string
  ): Promise<void> {
    const chatEnabled = status === "CONFIRMED";
    await this._chatRepository.setChatEnabledByBookingId(bookingId, chatEnabled);
  }
}

