import type { NotificationPushDTO } from "../../services/notification/notification.types";

export interface INotificationRealtimePublisher {
  publishToUser(userId: string, payload: NotificationPushDTO): void;
  publishToRole(role: string, payload: NotificationPushDTO): void;
}

