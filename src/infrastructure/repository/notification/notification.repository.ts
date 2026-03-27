import { injectable } from "tsyringe";
import type { INotificationEntity } from "../../../domain/entities/notification.entity";
import type {
  INotificationRepository,
  ListNotificationsParams,
  ListNotificationsResult,
} from "../../../domain/repositoryInterfaces/Notification/notification.repository.interface";
import { notificationDB } from "../../database/models/notification.model";
import type { INotificationModel } from "../../database/schemas/notification.schema";
import { BaseRepository } from "../baseRepository";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel, INotificationEntity>
  implements INotificationRepository
{
  constructor() {
    super(notificationDB, (doc) => ({
      _id: String(doc._id),
      channel: doc.channel,
      recipientUserId: String(doc.recipientUserId),
      recipientRole: doc.recipientRole ?? undefined,
      type: doc.type as INotificationEntity["type"],
      title: doc.title,
      message: doc.message,
      link: doc.link ?? undefined,
      metadata: doc.metadata,
      readAt: doc.readAt ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async countUnread(recipientUserId: string): Promise<number> {
    return notificationDB
      .countDocuments({ recipientUserId, readAt: null })
      .exec();
  }

  async listForRecipient(params: ListNotificationsParams): Promise<ListNotificationsResult> {
    const page = params.page > 0 ? params.page : 1;
    const limit = params.limit > 0 ? Math.min(100, params.limit) : 10;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { recipientUserId: params.recipientUserId };
    if (params.unreadOnly) query.readAt = null;

    const [docs, totalItems, unreadCount] = await Promise.all([
      notificationDB
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      notificationDB.countDocuments(query).exec(),
      notificationDB
        .countDocuments({ recipientUserId: params.recipientUserId, readAt: null })
        .exec(),
    ]);

    return {
      items: docs.map((doc) => ({
        _id: String(doc._id),
        channel: doc.channel,
        recipientUserId: String(doc.recipientUserId),
        recipientRole: doc.recipientRole ?? undefined,
        type: doc.type as INotificationEntity["type"],
        title: doc.title,
        message: doc.message,
        link: doc.link ?? undefined,
        metadata: doc.metadata,
        readAt: doc.readAt ?? undefined,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      totalItems,
      unreadCount,
      page,
      limit,
    };
  }

  async markRead(
    notificationId: string,
    recipientUserId: string,
    readAt: Date
  ): Promise<boolean> {
    const res = await notificationDB.updateOne(
      { _id: notificationId, recipientUserId, readAt: null },
      { $set: { readAt } }
    );
    return (res.modifiedCount ?? 0) > 0;
  }

  async markAllRead(recipientUserId: string, readAt: Date): Promise<number> {
    const res = await notificationDB.updateMany(
      { recipientUserId, readAt: null },
      { $set: { readAt } }
    );
    return res.modifiedCount ?? 0;
  }
}

