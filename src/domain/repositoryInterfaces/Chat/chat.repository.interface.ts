import type { IChatConversationEntity } from "../../entities/chat-conversation.entity";
import type { IChatMessageEntity } from "../../entities/chat-message.entity";

export interface CreateConversationInput {
  bookingId: string;
  participants: {
    clientUserId: string;
    caretakerUserId: string;
  };
  chatEnabled: boolean;
}

export interface ListConversationsQuery {
  userId: string;
  role: "client" | "caretaker";
  limit?: number;
}

export interface GetMessagesQuery {
  bookingId: string;
  cursor?: string; // message _id
  limit?: number;
}

export interface CreateMessageInput {
  bookingId: string;
  conversationId: string;
  senderUserId: string;
  senderRole: "client" | "caretaker";
  text: string;
  clientMessageId?: string;
}

export interface IChatRepository {
  getConversationByBookingId(
    bookingId: string
  ): Promise<IChatConversationEntity | null>;

  upsertConversationByBookingId(
    input: CreateConversationInput
  ): Promise<IChatConversationEntity>;

  setChatEnabledByBookingId(
    bookingId: string,
    chatEnabled: boolean
  ): Promise<void>;

  updateConversationLastMessageByBookingId(
    bookingId: string,
    lastMessageAt: Date,
    lastMessagePreview: string
  ): Promise<void>;

  listConversations(
    query: ListConversationsQuery
  ): Promise<IChatConversationEntity[]>;

  getMessages(query: GetMessagesQuery): Promise<IChatMessageEntity[]>;

  createMessage(input: CreateMessageInput): Promise<IChatMessageEntity>;
}

