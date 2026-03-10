import mongoose, { Schema, Types } from "mongoose";
import type {
  IChatConversationEntity,
  IChatConversationParticipants,
} from "../../../domain/entities/chat-conversation.entity";

export interface IChatConversationModel
  extends Omit<IChatConversationEntity, "_id" | "bookingId">,
    mongoose.Document {
  bookingId: Types.ObjectId;
  participants: IChatConversationParticipants;
}

const participantsSchema = new Schema<IChatConversationParticipants>(
  {
    clientUserId: { type: String, required: true, index: true },
    caretakerUserId: { type: String, required: true, index: true },
  },
  { _id: false }
);

export const chatConversationSchema = new Schema<IChatConversationModel>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: true,
      unique: true,
      index: true,
    },
    participants: { type: participantsSchema, required: true },
    chatEnabled: { type: Boolean, required: true, default: false, index: true },
    lastMessageAt: { type: Date, default: null, index: true },
    lastMessagePreview: { type: String, default: null },
  },
  { timestamps: true }
);

chatConversationSchema.index({ "participants.clientUserId": 1, lastMessageAt: -1 });
chatConversationSchema.index({
  "participants.caretakerUserId": 1,
  lastMessageAt: -1,
});

