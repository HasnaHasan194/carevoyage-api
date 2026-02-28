import { IsOptional, IsString, MaxLength } from "class-validator";

export class CancelBookingRequestDTO {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

