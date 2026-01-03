import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class ForgotPasswordRequestDTO {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsOptional()
  @IsEnum(["client", "admin", "caretaker", "agency_owner"], {
    message: "Invalid role. Must be one of: client, admin, caretaker, agency_owner",
  })
  role?: "client" | "admin" | "caretaker" | "agency_owner";
}

