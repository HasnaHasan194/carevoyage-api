import { inject, injectable } from "tsyringe";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { MAIL_CONTENT_PURPOSE } from "../../../../shared/constants/constants";

@injectable()
export class ResendOtpUsecase {
  constructor(
    @inject("IOtpService") private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    await this._otpService.deleteOtp(email);

    const otp = this._otpService.generateOtp();
    await this._otpService.storeOtp(email, otp);

    eventBus.emit(
      "SENDMAIL",
      email,
      "OTP Resend",
      mailContentProvider(MAIL_CONTENT_PURPOSE.OTP, otp)
    );
  }
}
