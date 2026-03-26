import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class ChangePasswordRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "New password is required" })
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
  newPassword!: string;

  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}

