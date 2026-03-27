import { inject, injectable } from "tsyringe";
import type { IMarkAllNotificationsReadUseCase } from "../../interfaces/notification/mark-all-notifications-read.interface";
import type { INotificationRepository } from "../../../../domain/repositoryInterfaces/Notification/notification.repository.interface";

@injectable()
export class MarkAllNotificationsReadUseCase implements IMarkAllNotificationsReadUseCase {
  constructor(
    @inject("INotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(params: { userId: string }): Promise<number> {
    return this._notificationRepository.markAllRead(params.userId, new Date());
  }
}

