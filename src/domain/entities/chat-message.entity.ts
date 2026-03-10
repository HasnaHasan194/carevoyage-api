import type { TChatConversationParticipantRole } from "./chat-conversation.entity";

export interface IChatMessageEntity {
  _id: string;
  conversationId: string;
  bookingId: string;
  senderUserId: string;
  senderRole: TChatConversationParticipantRole;
  text: string;
  clientMessageId?: string | null;
  createdAt: Date;
}

