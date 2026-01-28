import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsDateString,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  ValidateIf,
  Validate,
  IsIn,
} from "class-validator";
import { Transform } from "class-transformer";
import { PACKAGE_CATEGORIES } from "../../../domain/constants/package-categories";
import {
  IsNotPastDateConstraint,
  IsEndDateAfterStartDateConstraint,
} from "./date.validators";

export class UpdatePackageBasicDTO {
  @IsString()
  @IsNotEmpty({ message: "Package name is required" })
  @MinLength(3, { message: "Package name must be at least 3 characters" })
  @MaxLength(100, { message: "Package name must not exceed 100 characters" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Package name can only contain alphabets and spaces",
  })
  @ValidateIf((o) => o.PackageName !== undefined && o.PackageName !== null)
  @Transform(({ value }) => value?.trim())
  PackageName?: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters" })
  @MaxLength(1000, { message: "Description must not exceed 1000 characters" })
  @ValidateIf((o) => o.description !== undefined && o.description !== null)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "Category is required" })
  @IsIn(PACKAGE_CATEGORIES, {
    message:
      "category must be one of: Sightseeing, Adventure, Cultural, Spiritual, Wellness, Family, Honeymoon, Nature, Heritage",
  })
  @ValidateIf((o) => o.category !== undefined && o.category !== null)
  @Transform(({ value }) => value?.trim())
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty({ message: "Meeting point is required" })
  @MinLength(3, { message: "Meeting point must be at least 3 characters" })
  @MaxLength(200, { message: "Meeting point must not exceed 200 characters" })
  @ValidateIf((o) => o.meetingPoint !== undefined && o.meetingPoint !== null)
  @Transform(({ value }) => value?.trim())
  meetingPoint?: string;

  @IsNumber()
  @Min(1, { message: "Max group size must be at least 1" })
  @ValidateIf((o) => o.maxGroupSize !== undefined && o.maxGroupSize !== null)
  maxGroupSize?: number;

  @IsNumber()
  @Min(0.01, { message: "Base price must be greater than 0" })
  @ValidateIf((o) => o.basePrice !== undefined && o.basePrice !== null)
  basePrice?: number;

  @IsDateString({}, { message: "Start date must be a valid date string" })
  @Validate(IsNotPastDateConstraint)
  @ValidateIf((o) => o.startDate !== undefined && o.startDate !== null)
  startDate?: string;

  @IsDateString({}, { message: "End date must be a valid date string" })
  @Validate(IsNotPastDateConstraint)
  @Validate(IsEndDateAfterStartDateConstraint)
  @ValidateIf((o) => o.endDate !== undefined && o.endDate !== null)
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // Note: Image validation (at least one exists) is handled in usecase
  images?: string[];
}

