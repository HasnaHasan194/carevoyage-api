import { Schema, Document, Types } from "mongoose";
import type {
  INotificationEntity,
  NotificationMetadata,
  TNotificationChannel,
  TNotificationRecipientRole,
  TNotificationType,
} from "../../../domain/entities/notification.entity";

export interface INotificationModel
  extends Omit<
      INotificationEntity,
      "_id" | "recipientUserId" | "readAt" | "metadata"
    >,
    Document {
  recipientUserId: Types.ObjectId;
  readAt?: Date | null;
  metadata: NotificationMetadata;
}

export const notificationSchema = new Schema<INotificationModel>(
  {
    channel: {
      type: String,
      enum: ["IN_APP"] as TNotificationChannel[],
      default: "IN_APP",
      required: true,
    },
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ["client", "agency_owner", "caretaker", "admin"] as TNotificationRecipientRole[],
      required: false,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
      // we keep enum validation lightweight (string union enforced at compile-time)
      // and rely on application layer for strict type safety.
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
    },
    readAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientUserId: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ recipientUserId: 1, createdAt: -1 });

