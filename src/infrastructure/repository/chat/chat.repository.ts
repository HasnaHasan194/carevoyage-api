import { injectable } from "tsyringe";
import mongoose from "mongoose";
import type { IChatRepository } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type {
  CreateConversationInput,
  CreateMessageInput,
  GetMessagesQuery,
  ListConversationsQuery,
} from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import { chatConversationDB } from "../../database/models/chat-conversation.model";
import { chatMessageDB } from "../../database/models/chat-message.model";
import type { IChatConversationEntity } from "../../../domain/entities/chat-conversation.entity";
import type { IChatMessageEntity } from "../../../domain/entities/chat-message.entity";

function toConversationEntity(doc: any): IChatConversationEntity {
  return {
    _id: String(doc._id),
    bookingId: String(doc.bookingId),
    participants: {
      clientUserId: doc.participants.clientUserId,
      caretakerUserId: doc.participants.caretakerUserId,
    },
    chatEnabled: Boolean(doc.chatEnabled),
    lastMessageAt: doc.lastMessageAt ?? null,
    lastMessagePreview: doc.lastMessagePreview ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toMessageEntity(doc: any): IChatMessageEntity {
  const attachmentsRaw = Array.isArray(doc.attachments) ? doc.attachments : [];
  const attachments = attachmentsRaw
    .map((a: any) => ({
      kind: a?.kind,
      s3Key: a?.s3Key,
      originalName: a?.originalName,
      mimeType: a?.mimeType,
      sizeBytes: a?.sizeBytes,
      url: a?.url,
    }))
    .filter((a: any) => Boolean(a?.s3Key));

  return {
    _id: String(doc._id),
    conversationId: String(doc.conversationId),
    bookingId: String(doc.bookingId),
    senderUserId: doc.senderUserId,
    senderRole: doc.senderRole,
    text: doc.text ?? "",
    attachments,
    clientMessageId: doc.clientMessageId ?? null,
    createdAt: doc.createdAt,
  };
}

@injectable()
export class ChatRepository implements IChatRepository {
  async getConversationByBookingId(
    bookingId: string
  ): Promise<IChatConversationEntity | null> {
    const doc = await chatConversationDB
      .findOne({ bookingId: new mongoose.Types.ObjectId(bookingId) })
      .exec();
    return doc ? toConversationEntity(doc) : null;
  }

  async upsertConversationByBookingId(
    input: CreateConversationInput
  ): Promise<IChatConversationEntity> {
    const doc = await chatConversationDB
      .findOneAndUpdate(
        { bookingId: new mongoose.Types.ObjectId(input.bookingId) },
        {
          $setOnInsert: {
            bookingId: new mongoose.Types.ObjectId(input.bookingId),
            participants: input.participants,
          },
          $set: {
            chatEnabled: input.chatEnabled,
          },
        },
        { new: true, upsert: true }
      )
      .exec();
    return toConversationEntity(doc);
  }

  async setChatEnabledByBookingId(
    bookingId: string,
    chatEnabled: boolean
  ): Promise<void> {
    await chatConversationDB
      .updateOne(
        { bookingId: new mongoose.Types.ObjectId(bookingId) },
        { $set: { chatEnabled } }
      )
      .exec();
  }

  async updateConversationLastMessageByBookingId(
    bookingId: string,
    lastMessageAt: Date,
    lastMessagePreview: string
  ): Promise<void> {
    await chatConversationDB
      .updateOne(
        { bookingId: new mongoose.Types.ObjectId(bookingId) },
        { $set: { lastMessageAt, lastMessagePreview } }
      )
      .exec();
  }

  async listConversations(
    query: ListConversationsQuery
  ): Promise<IChatConversationEntity[]> {
    const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
    const match =
      query.role === "client"
        ? { "participants.clientUserId": query.userId }
        : { "participants.caretakerUserId": query.userId };

    const docs = await chatConversationDB
      .find(match)
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .limit(limit)
      .exec();

    return docs.map(toConversationEntity);
  }

  async getMessages(query: GetMessagesQuery): Promise<IChatMessageEntity[]> {
    const limit = Math.min(Math.max(query.limit ?? 30, 1), 100);
    const filter: Record<string, any> = {
      bookingId: new mongoose.Types.ObjectId(query.bookingId),
    };
    if (query.cursor) {
      filter._id = { $lt: new mongoose.Types.ObjectId(query.cursor) };
    }

    const docs = await chatMessageDB
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .exec();

    
    return docs.reverse().map(toMessageEntity);
  }

  async createMessage(input: CreateMessageInput): Promise<IChatMessageEntity> {
    const doc = await chatMessageDB.create({
      bookingId: new mongoose.Types.ObjectId(input.bookingId),
      conversationId: new mongoose.Types.ObjectId(input.conversationId),
      senderUserId: input.senderUserId,
      senderRole: input.senderRole,
      text: input.text ?? "",
      attachments: input.attachments ?? [],
      clientMessageId: input.clientMessageId ?? null,
    });
    return toMessageEntity(doc);
  }
}

