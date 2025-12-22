import { IsEmail, IsString } from "class-validator";

export class VerifyOtpAndCreateAgencyDTO {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;

  agencyData!: any;
}
