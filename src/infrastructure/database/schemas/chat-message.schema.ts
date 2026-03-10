import mongoose, { Schema, Types } from "mongoose";
import type { IChatMessageEntity } from "../../../domain/entities/chat-message.entity";

export interface IChatMessageModel
  extends Omit<IChatMessageEntity, "_id" | "conversationId" | "bookingId">,
    mongoose.Document {
  conversationId: Types.ObjectId;
  bookingId: Types.ObjectId;
}

export const chatMessageSchema = new Schema<IChatMessageModel>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "chat_conversation",
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: true,
      index: true,
    },
    senderUserId: { type: String, required: true, index: true },
    senderRole: { type: String, enum: ["client", "caretaker"], required: true },
    text: { type: String, required: true, trim: true },
    clientMessageId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

chatMessageSchema.index({ bookingId: 1, createdAt: -1 });
chatMessageSchema.index({ conversationId: 1, createdAt: -1 });
chatMessageSchema.index(
  { bookingId: 1, senderUserId: 1, clientMessageId: 1 },
  {
    unique: true,
    partialFilterExpression: { clientMessageId: { $type: "string" } },
  }
);

