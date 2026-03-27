import type { ListNotificationsResult } from "../../../../domain/repositoryInterfaces/Notification/notification.repository.interface";

export interface IListMyNotificationsUseCase {
  execute(params: {
    userId: string;
    page: number;
    limit: number;
    unreadOnly?: boolean;
  }): Promise<ListNotificationsResult>;
}

