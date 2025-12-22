import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class SendOtpRequestDTO {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit Indian number",
  })
  phone!: string;
}
