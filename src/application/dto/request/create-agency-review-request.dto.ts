import { Transform } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class CreateAgencyReviewRequestDTO {
  @IsString({ message: "Booking ID must be a string" })
  @IsNotEmpty({ message: "Booking ID is required" })
  @IsMongoId({ message: "Booking ID must be a valid MongoDB ObjectId" })
  bookingId!: string;

  @IsInt({ message: "Rating must be an integer" })
  @Min(1, { message: "Rating must be at least 1" })
  @Max(5, { message: "Rating must be at most 5" })
  rating!: number;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString({ message: "Review text must be a string" })
  @IsNotEmpty({ message: "Review text is required" })
  @MinLength(3, { message: "Review text must be at least 3 characters" })
  @MaxLength(300, { message: "Review text must be at most 300 characters" })
  @Matches(/^(?!.*\d)[\p{L}\s.,!?'"()-]+$/u, {
    message: "Review text must contain only letters and punctuation (no numbers)",
  })
  reviewText!: string;
}
