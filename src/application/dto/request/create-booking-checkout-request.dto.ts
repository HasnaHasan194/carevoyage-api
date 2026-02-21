import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateBookingCheckoutRequestDTO {
  @IsMongoId({ message: "Package ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Package ID is required" })
  packageId!: string;

  @IsOptional()
  @IsNumber({}, { message: "Caretaker fee must be a number" })
  @Min(0, { message: "Caretaker fee cannot be negative" })
  @Transform(({ value }) => (value === "" || value === null ? undefined : Number(value)))
  caretakerFee?: number;

  @IsOptional()
  @IsArray({ message: "Special need IDs must be an array" })
  @IsMongoId({ each: true, message: "Each special need ID must be a valid MongoDB ObjectId" })
  specialNeedIds?: string[];
}
