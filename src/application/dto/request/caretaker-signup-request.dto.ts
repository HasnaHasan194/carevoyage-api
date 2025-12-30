import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsPhoneNumber,
} from "class-validator";

export class CaretakerSignupRequestDTO {
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  token!: string;

  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  lastName!: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password!: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone is required" })
  phone!: string;
}




