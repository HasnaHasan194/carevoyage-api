import { IsEmail, IsString } from "class-validator";

export class VerifyOtpAndCreateAgencyDTO {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agencyData!: any;
}
