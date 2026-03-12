import { IsNotEmpty, IsString, IsInt, Min, Max } from "class-validator";

export class CreateAgencyReviewRequestDTO {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  reviewText!: string;
}

