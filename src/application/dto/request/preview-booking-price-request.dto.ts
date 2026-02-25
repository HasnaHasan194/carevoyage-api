import {
  IsMongoId,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from "class-validator";

export class PreviewBookingPriceRequestDTO {
  @IsMongoId({ message: "Package ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Package ID is required" })
  packageId!: string;

  @IsOptional()
  @IsArray({ message: "Special need IDs must be an array" })
  @IsMongoId({ each: true, message: "Each special need ID must be a valid MongoDB ObjectId" })
  specialNeedIds?: string[];

  @IsOptional()
  @IsMongoId({ message: "Caretaker ID must be a valid MongoDB ObjectId" })
  caretakerId?: string;
}
