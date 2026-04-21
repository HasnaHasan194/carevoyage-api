import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class CaretakerSignupRequestDTO {
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  token!: string;

  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  @Matches(/^(?!([A-Za-z])\1+$)[A-Za-z]+$/, {
    message: "First name must contain only letters",
  })
  firstName!: string;

  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  @Matches(/^(?!([A-Za-z])\1+$)[A-Za-z]+$/, {
    message: "Last name must contain only letters",
  })
  lastName!: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      "Password must include uppercase, lowercase, number, and symbol",
  })
  password!: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone is required" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @Matches(/^(?!([0-9])\1{9})[6-9]\d{9}$/, { message: "Phone must be 10 digits and start with 6-9" })
  phone!: string;
}











