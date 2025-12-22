export interface IVerifyOtpAndCreateAgencyUsecase {
  execute(
    email: string,
    otp: string,
    agencyData: {
      userId: string;
      agencyName: string;
      address: string;
      registrationNumber: string;
      description?: string;
    }
  ): Promise<void>;
}
