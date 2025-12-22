// import {
//   IsEmail,
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   Matches,
//   MinLength,
//   Validate,
// } from "class-validator";
// import { Transform } from "class-transformer";
// import { MatchPasswordConstraint } from "./password.validator";

// export class AgencyRegisterRequestDTO {
//   @IsString()
//   @IsNotEmpty({ message: "Agency name is required" })
//   @MinLength(2, { message: "Agency name must be at least 2 characters" })
//   @Transform(({ value }) => value?.trim())
//   agencyName!: string;

//   @IsOptional()
//   @IsString()
//   @MinLength(10, { message: "Description m  ust be at least 10 characters" })
//   description?: string;

//   @IsString()
//   @IsNotEmpty({ message: "First name is required" })
//   @MinLength(2, { message: "First name must be at least 2 characters" })
//   @Matches(/^[A-Za-z]+$/, {
//     message: "First name must contain only letters",
//   })
//   @Transform(({ value }) => value?.trim())
//   firstName!: string;

//   @IsString()
//   @IsNotEmpty({ message: "Last name is required" })
//   @MinLength(2, { message: "Last name must be at least 2 characters" })
//   @Matches(/^[A-Za-z]+$/, {
//     message: "Last name must contain only letters",
//   })
//   @Transform(({ value }) => value?.trim())
//   lastName!: string;

//   @IsEmail({}, { message: "Invalid email format" })
//   email!: string;

//   @IsString()
//   @Matches(/^[6-9]\d{9}$/, {
//     message: "Phone number must be a valid 10-digit Indian number",
//   })
//   phone!: string;

//   @IsString()
//   @MinLength(8, { message: "Password must be at least 8 characters" })
//   @Matches(/[a-z]/, {
//     message: "Password must contain at least one lowercase letter",
//   })
//   @Matches(/[A-Z]/, {
//     message: "Password must contain at least one uppercase letter",
//   })
//   @Matches(/[0-9]/, {
//     message: "Password must contain at least one number",
//   })
//   @Matches(/[@$!%*?&]/, {
//     message: "Password must contain at least one special character",
//   })
//   password!: string;

//   @IsEnum(["agency_owner"], {
//     message: "Invalid role",
//   })
//   role!: "agency_owner";

//   @IsString()
//   @IsNotEmpty({ message: "Confirm password is required" })
//   @Validate(MatchPasswordConstraint)
//   confirmPassword!: string;
// }

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  Validate,
} from "class-validator";
import { Transform } from "class-transformer";
import { MatchPasswordConstraint } from "./password.validator";

export class AgencyRegisterRequestDTO {

  @IsString()
  @IsNotEmpty({ message: "Agency name is required" })
  @MinLength(2, { message: "Agency name must be at least 2 characters" })
  @Transform(({ value }) => value?.trim())
  agencyName!: string;

  @IsString()
  @IsNotEmpty({ message: "Address is required" })
  @MinLength(5, { message: "Address must be at least 5 characters" })
  @Transform(({ value }) => value?.trim())
  address!: string;

  @IsString()
  @IsNotEmpty({ message: "Registration number is required" })
  @MinLength(3, { message: "Registration number is required" })
  @Transform(({ value }) => value?.trim())
  registrationNumber!: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: "Description must be at least 10 characters" })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  @MinLength(2, { message: "First name must be at least 2 characters" })
  @Matches(/^[A-Za-z]+$/, {
    message: "First name must contain only letters",
  })
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  @MinLength(2, { message: "Last name must be at least 2 characters" })
  @Matches(/^[A-Za-z]+$/, {
    message: "Last name must contain only letters",
  })
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit Indian number",
  })
  phone!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  @Matches(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  })
  password!: string;

  @IsEnum(["agency_owner"], {
    message: "Invalid role",
  })
  role!: "agency_owner";

  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  @Validate(MatchPasswordConstraint)
  confirmPassword!: string;
}
