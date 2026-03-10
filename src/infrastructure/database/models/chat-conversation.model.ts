import mongoose, { Document } from "mongoose";
import type { IChatConversationEntity } from "../../../domain/entities/chat-conversation.entity";
import {
  chatConversationSchema,
  type IChatConversationModel,
} from "../schemas/chat-conversation.schema";

export interface IChatConversationDoc
  extends Omit<IChatConversationEntity, "_id">,
    Document {}

export const chatConversationDB = mongoose.model<IChatConversationModel>(
  "chat_conversation",
  chatConversationSchema
);

