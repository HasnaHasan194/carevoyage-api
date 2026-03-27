import { inject, injectable } from "tsyringe";
import type { IMarkNotificationReadUseCase } from "../../interfaces/notification/mark-notification-read.interface";
import type { INotificationRepository } from "../../../../domain/repositoryInterfaces/Notification/notification.repository.interface";

@injectable()
export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase {
  constructor(
    @inject("INotificationRepository")
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(params: { userId: string; notificationId: string }): Promise<boolean> {
    return this._notificationRepository.markRead(
      params.notificationId,
      params.userId,
      new Date()
    );
  }
}

