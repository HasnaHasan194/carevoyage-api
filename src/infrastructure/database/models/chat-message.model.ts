import mongoose, { Document } from "mongoose";
import type { IChatMessageEntity } from "../../../domain/entities/chat-message.entity";
import {
  chatMessageSchema,
  type IChatMessageModel,
} from "../schemas/chat-message.schema";

export interface IChatMessageDoc extends Omit<IChatMessageEntity, "_id">, Document {}

export const chatMessageDB = mongoose.model<IChatMessageModel>(
  "chat_message",
  chatMessageSchema
);

