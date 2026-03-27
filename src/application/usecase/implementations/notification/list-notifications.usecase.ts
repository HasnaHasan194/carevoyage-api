import { inject, injectable } from "tsyringe";
import type { IListMyNotificationsUseCase } from "../../interfaces/notification/list-notifications.interface";
import type { INotificationRepository } from "../../../../domain/repositoryInterfaces/Notification/notification.repository.interface";

@injectable()
export class ListMyNotificationsUseCase implements IListMyNotificationsUseCase {
  constructor(
    @inject("INotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(params: {
    userId: string;
    page: number;
    limit: number;
    unreadOnly?: boolean;
  }) {
    return this._notificationRepository.listForRecipient({
      recipientUserId: params.userId,
      page: params.page,
      limit: params.limit,
      unreadOnly: params.unreadOnly,
    });
  }
}

