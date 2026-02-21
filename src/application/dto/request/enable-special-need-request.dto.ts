import {
  IsMongoId,
  IsEnum,
  IsNumber,
  Min,
  IsNotEmpty,
} from "class-validator";

export class EnableSpecialNeedRequestDTO {
  @IsMongoId({ message: "Special need ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Special need ID is required" })
  specialNeedId!: string;

  @IsEnum(["per_day", "per_trip"], {
    message: "Unit must be either 'per_day' or 'per_trip'",
  })
  @IsNotEmpty({ message: "Unit is required" })
  unit!: "per_day" | "per_trip";

  @IsNumber({}, { message: "Price must be a number" })
  @Min(0.01, { message: "Price must be greater than 0" })
  @IsNotEmpty({ message: "Price is required" })
  price!: number;
}
