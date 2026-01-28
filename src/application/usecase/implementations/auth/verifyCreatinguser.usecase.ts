import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { IVerifyOtpAndCreateUserUsecase } from "../../interfaces/auth/verify-otp-user.usecase.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class VerifyOtpAndCreateUserUsecase
  implements IVerifyOtpAndCreateUserUsecase
{
  constructor(
    @inject("IOtpService")
    private _otpService: IOtpService,

    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    email: string,
    otp: string,
    userData: {
      firstName: string;
      lastName: string;
      password: string;
      phone: string;
    }
  ): Promise<void> {
    const isValid = await this._otpService.verifyOtp({ email, otp });
    if (!isValid) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_OTP);
    }

    await this._otpService.deleteOtp(email);

    const hashedPassword = await hashPassword(userData.password);

    await this._userRepository.save({
      ...userData,
      email,
      password : hashedPassword,
      isBlocked: false,
    });
  }
}
