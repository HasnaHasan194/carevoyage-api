export interface IMarkNotificationReadUseCase {
  execute(params: { userId: string; notificationId: string }): Promise<boolean>;
}

