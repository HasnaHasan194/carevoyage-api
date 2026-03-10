import type { IChatConversationEntity } from "../../../domain/entities/chat-conversation.entity";

export interface IListChatConversationsUseCase {
  execute(
    userId: string,
    role: "client" | "caretaker",
    limit?: number
  ): Promise<(IChatConversationEntity & { otherPartyName?: string; packageName?: string })[]>;
}

