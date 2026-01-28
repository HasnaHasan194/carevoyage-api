import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class VerifyOtpUsecase {
  constructor(
    @inject("IOtpService") private _otpService: IOtpService
  ) {}

  async execute(email: string, otp: string) {
    const isValid = await this._otpService.verifyOtp({ email, otp });

    if (!isValid) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_OTP);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGE.AUTHORIZATION.OTP_VERIFIED,
    };
  }
}
