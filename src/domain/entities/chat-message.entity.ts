import type { TChatConversationParticipantRole } from "./chat-conversation.entity";

export type ChatAttachmentKind = "image" | "file";

export interface ChatAttachmentEntity {
  kind: ChatAttachmentKind;
  s3Key: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  /**
   * Signed URL for private S3 access. Populated at read/send time.
   */
  url?: string;
}

export interface IChatMessageEntity {
  _id: string;
  conversationId: string;
  bookingId: string;
  senderUserId: string;
  senderRole: TChatConversationParticipantRole;
  /**
   * Text content of the message. For attachments-only messages, this can be an empty string.
   */
  text: string;
  attachments?: ChatAttachmentEntity[] | null;
  clientMessageId?: string | null;
  createdAt: Date;
}

