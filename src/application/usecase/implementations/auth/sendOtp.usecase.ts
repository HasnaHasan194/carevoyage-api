import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";

@injectable()
export class SendOtpUsecase {
  constructor(
    @inject("IOtpService") private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError("Email is required");
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
