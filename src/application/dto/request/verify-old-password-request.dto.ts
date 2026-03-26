import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class VerifyOldPasswordRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Old password is required" })
  @MinLength(8, { message: "Old password must be at least 8 characters" })
  oldPassword!: string;
}

