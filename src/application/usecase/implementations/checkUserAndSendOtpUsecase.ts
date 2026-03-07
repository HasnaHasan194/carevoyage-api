import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IOtpService } from "../../../domain/service-interfaces/otp-service.interface";
import { ValidationError } from "../../../domain/errors/validationError";
import { eventBus } from "../../../shared/eventBus";
import { mailContentProvider } from "../../../shared/mailContentProvider";
import { ICheckUserAndSendOtpUsecase } from "../interfaces/check-user-verify-usecase.interface";
import { MAIL_CONTENT_PURPOSE, ERROR_MESSAGE } from "../../../shared/constants/constants";

@injectable()
export class CheckUserAndSendOtpUsecase implements ICheckUserAndSendOtpUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IOtpService")
    private _otpService: IOtpService
  ) {}

  async execute(data: {
    email: string;
    phone: string;
  }): Promise<void> {
    const { email, phone } = data;

    if (!email || !phone) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_AND_PHONE_REQUIRED);
    }

    const existingEmail = await this._userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_EXISTS);
    }

    const existingPhone = await this._userRepository.findByPhone(phone);
    if (existingPhone) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.PHONE_NUMBER_EXISTS);
    }

    const otp = this._otpService.generateOtp();
    // #region agent log
    try { require('fs').appendFileSync(require('path').join(process.cwd(),'debug.log'), JSON.stringify({location:'checkUserAndSendOtpUsecase.ts:beforeStoreOtp',message:'About to store OTP in Redis',data:{email,otp},timestamp:Date.now(),hypothesisId:'H3'})+'\n'); } catch(e){}
    // #endregion
    await this._otpService.storeOtp(email, otp);
    // #region agent log
    try { require('fs').appendFileSync(require('path').join(process.cwd(),'debug.log'), JSON.stringify({location:'checkUserAndSendOtpUsecase.ts:afterStoreOtp',message:'OTP stored successfully',data:{email,otp},timestamp:Date.now(),hypothesisId:'H3'})+'\n'); } catch(e){}
    // #endregion
    console.log(otp,"-->otp")
    eventBus.emit(
      "SENDMAIL",
      email,
      "OTP Verification",
      mailContentProvider(MAIL_CONTENT_PURPOSE.OTP, otp)
    );
  }
}
