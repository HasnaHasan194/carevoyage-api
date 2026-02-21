import {
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
} from "class-validator";

export class UpdateSpecialNeedRequestDTO {
  @IsOptional()
  @IsEnum(["per_day", "per_trip"], {
    message: "Unit must be either 'per_day' or 'per_trip'",
  })
  unit?: "per_day" | "per_trip";

  @IsOptional()
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0.01, { message: "Price must be greater than 0" })
  price?: number;
}
