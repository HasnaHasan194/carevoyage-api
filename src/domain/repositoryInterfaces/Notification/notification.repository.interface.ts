import type { ClientSession } from "mongoose";
import type { INotificationEntity } from "../../entities/notification.entity";
import type { IBaseRepository } from "../baseRepository.interface";

export interface ListNotificationsParams {
  recipientUserId: string;
  unreadOnly?: boolean;
  page: number;
  limit: number;
}

export interface ListNotificationsResult {
  items: INotificationEntity[];
  totalItems: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface INotificationRepository extends IBaseRepository<INotificationEntity> {
  listForRecipient(params: ListNotificationsParams): Promise<ListNotificationsResult>;
  markRead(notificationId: string, recipientUserId: string, readAt: Date): Promise<boolean>;
  markAllRead(recipientUserId: string, readAt: Date): Promise<number>;
  countUnread(recipientUserId: string): Promise<number>;
  save(
    data: Partial<INotificationEntity>,
    session?: ClientSession
  ): Promise<INotificationEntity>;
}

