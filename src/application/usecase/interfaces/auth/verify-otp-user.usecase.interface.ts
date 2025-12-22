export interface IVerifyOtpAndCreateUserUsecase {
  execute(
    email: string,
    otp: string,
    userData: {
      firstName: string;
      lastName: string;
      password: string;
      phone: string;
    }
  ): Promise<void>;
}
