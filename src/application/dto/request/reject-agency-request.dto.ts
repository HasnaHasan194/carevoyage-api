import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class RejectAgencyRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Rejection reason is required" })
  @MinLength(1, { message: "Rejection reason is required" })
  reason!: string;
}
