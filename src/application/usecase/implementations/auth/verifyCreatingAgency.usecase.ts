import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";

@injectable()
export class VerifyOtpAndCreateAgencyUsecase {
  constructor(
    @inject("IOtpService") private _otpService: IOtpService,
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("IAgencyRepository") private _agencyRepo: IAgencyRepository
  ) {}

  async execute(
    email: string,
    otp: string,
    data: {
      userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        role: "agency_owner";
      };
      agencyName: string;
      address: string;
      registrationNumber: string;
      description?: string;
    }
  ) {
    const isValid = await this._otpService.verifyOtp({ email, otp });
    if (!isValid) throw new ValidationError("Invalid OTP");

    await this._otpService.deleteOtp(email);
    const hashedPassword=await hashPassword(data.userData.password)
    

    const user = await this._userRepo.save({
      firstName: data.userData.firstName,
      lastName: data.userData.lastName,
      email: data.userData.email,
      phone: data.userData.phone,
      password:hashedPassword,
      role: "agency_owner",
      isBlocked: false,
    });

    return this._agencyRepo.save({
      userId: user._id,
      agencyName: data.agencyName,
      address: data.address,
      registrationNumber: data.registrationNumber,
      description: data.description,
      verificationStatus: "pending",
      isBlocked: false,
    });
  }
}
