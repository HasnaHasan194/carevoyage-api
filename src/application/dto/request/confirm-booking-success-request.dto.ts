import { IsString, IsNotEmpty } from "class-validator";

export class ConfirmBookingSuccessRequestDTO {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;
}
