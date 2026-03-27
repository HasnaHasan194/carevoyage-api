export interface IMarkAllNotificationsReadUseCase {
  execute(params: { userId: string }): Promise<number>;
}

