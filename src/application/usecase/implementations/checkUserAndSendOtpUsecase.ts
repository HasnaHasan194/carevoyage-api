import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IOtpService } from "../../../domain/service-interfaces/otp-service.interface";
import { ValidationError } from "../../../domain/errors/validationError";
import { eventBus } from "../../../shared/eventBus";
import { mailContentProvider } from "../../../shared/mailContentProvider";
import { ICheckUserAndSendOtpUsecase } from "../interfaces/check-user-verify-usecase.interface";

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
      throw new ValidationError("Email and phone are required");
    }

    const existingEmail = await this._userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ValidationError("Email already exists");
    }

    const existingPhone = await this._userRepository.findByPhone(phone);
    if (existingPhone) {
      throw new ValidationError("Phone number already exists");
    }

    const otp = this._otpService.generateOtp();
    await this._otpService.storeOtp(email, otp);
    console.log(otp,"-->otp")
    eventBus.emit(
      "SENDMAIL",
      email,
      "OTP Verification",
      mailContentProvider("OTP", otp)
    );
  }
}
