export type TChatConversationParticipantRole = "client" | "caretaker";

export interface IChatConversationParticipants {
  clientUserId: string;
  caretakerUserId: string;
}

export interface IChatConversationEntity {
  _id: string;
  bookingId: string;
  participants: IChatConversationParticipants;
  chatEnabled: boolean;
  lastMessageAt?: Date | null;
  lastMessagePreview?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

