import type {
  NotificationMetadata,
  TNotificationRecipientRole,
  TNotificationType,
} from "../../../domain/entities/notification.entity";

export interface NotificationCreateInput {
  recipientUserId: string;
  recipientRole?: TNotificationRecipientRole;
  type: TNotificationType;
  title: string;
  message: string;
  link?: string;
  metadata: NotificationMetadata;
}

export interface NotificationPushDTO {
  id: string;
  type: TNotificationType;
  title: string;
  message: string;
  link?: string;
  metadata: NotificationMetadata;
  createdAt: string;
  read: boolean;
}

