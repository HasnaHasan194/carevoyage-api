import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IChatRepository } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type { IChatMessageEntity } from "../../../domain/entities/chat-message.entity";
import type { IChatConversationEntity } from "../../../domain/entities/chat-conversation.entity";
import type { IBookingEntity } from "../../../domain/entities/booking.entity";

export interface ChatAuthContext {
  userId: string;
  role: "client" | "caretaker";
}

export interface SendMessageInput {
  bookingId: string;
  userId: string;
  text: string;
  clientMessageId?: string;
}

export interface IChatService {
  authorizeBookingParticipant(
    bookingId: string,
    userId: string
  ): Promise<ChatAuthContext>;

  ensureConversationForBooking(booking: IBookingEntity): Promise<IChatConversationEntity>;

  sendMessage(input: SendMessageInput): Promise<IChatMessageEntity>;
}

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IChatRepository")
    private readonly _chatRepository: IChatRepository
  ) {}

  async authorizeBookingParticipant(
    bookingId: string,
    userId: string
  ): Promise<ChatAuthContext> {
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.clientId === userId) {
      return { userId, role: "client" };
    }

    if (booking.caretakerId) {
      const caretakerProfile = await this._caretakerProfileRepository.findById(
        booking.caretakerId
      );
      if (caretakerProfile?.userId === userId) {
        return { userId, role: "caretaker" };
      }
    }

    throw new Error("Forbidden");
  }

  async ensureConversationForBooking(
    booking: IBookingEntity
  ): Promise<IChatConversationEntity> {
    if (!booking.caretakerId) {
      throw new Error("No caretaker assigned");
    }

    const caretakerProfile = await this._caretakerProfileRepository.findById(
      booking.caretakerId
    );
    const caretakerUserId = caretakerProfile?.userId;
    if (!caretakerUserId) {
      throw new Error("Caretaker user not linked");
    }

    const chatEnabled = booking.status === "CONFIRMED";

    return await this._chatRepository.upsertConversationByBookingId({
      bookingId: booking._id,
      participants: {
        clientUserId: booking.clientId,
        caretakerUserId,
      },
      chatEnabled,
    });
  }

  async sendMessage(input: SendMessageInput): Promise<IChatMessageEntity> {
    const booking = await this._bookingRepository.findById(input.bookingId);
    if (!booking) throw new Error("Booking not found");

    const auth = await this.authorizeBookingParticipant(
      input.bookingId,
      input.userId
    );

    const conversation = await this.ensureConversationForBooking(booking);
    if (!conversation.chatEnabled || booking.status !== "CONFIRMED") {
      throw new Error("Chat disabled");
    }

    const text = input.text.trim();
    if (!text) throw new Error("Empty message");

    const msg = await this._chatRepository.createMessage({
      bookingId: booking._id,
      conversationId: conversation._id,
      senderUserId: input.userId,
      senderRole: auth.role,
      text,
      clientMessageId: input.clientMessageId,
    });

    await this._chatRepository.updateConversationLastMessageByBookingId(
      booking._id,
      msg.createdAt,
      text.slice(0, 200)
    );

    return msg;
  }
}

