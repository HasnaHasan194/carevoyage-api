export interface ICheckUserAndSendOtpUsecase {
  execute(data: {
    email: string;
    phone: string;
  }): Promise<void>;
}
