import { inject, injectable } from "tsyringe";
import type { INotificationRepository } from "../../../domain/repositoryInterfaces/Notification/notification.repository.interface";
import type { INotificationRealtimePublisher } from "../../interfaces/realtime/notification-realtime.publisher.interface";
import type { NotificationCreateInput, NotificationPushDTO } from "./notification.types";

@injectable()
export class NotificationService {
  constructor(
    @inject("INotificationRepository")
    private readonly _notificationRepository: INotificationRepository,
    @inject("INotificationRealtimePublisher")
    private readonly _publisher: INotificationRealtimePublisher
  ) {}

  async createAndPublish(input: NotificationCreateInput): Promise<void> {
    const created = await this._notificationRepository.save({
      channel: "IN_APP",
      recipientUserId: input.recipientUserId,
      recipientRole: input.recipientRole,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
      metadata: input.metadata,
      readAt: undefined,
    });

    const payload: NotificationPushDTO = {
      id: created._id,
      type: created.type,
      title: created.title,
      message: created.message,
      link: created.link,
      metadata: created.metadata,
      createdAt: created.createdAt.toISOString(),
      read: false,
    };

    this._publisher.publishToUser(input.recipientUserId, payload);
    if (input.recipientRole) {
      this._publisher.publishToRole(input.recipientRole, payload);
    }
  }
}

