import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";

@injectable()
export class SendOtpUsecase {
  constructor(
    @inject("IOtpService") private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_REQUIRED);
    }
  
    const otp = this._otpService.generateOtp();
    await this._otpService.storeOtp(email, otp);
    console.log(otp)

    eventBus.emit(
      "SENDMAIL",
      email,
      "OTP Verification",
      mailContentProvider("OTP", otp)
    );
  }
}
