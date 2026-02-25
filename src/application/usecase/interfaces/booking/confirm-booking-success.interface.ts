export interface IConfirmBookingSuccessUseCase {
  execute(sessionId: string): Promise<void>;
}
