import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsIn,
  Matches,
  MinLength,
  MaxLength,
  ArrayMinSize,
  Validate,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import {
  PACKAGE_CATEGORIES,
  normalizePackageCategory,
  PackageCategory,
} from "../../../domain/constants/package-categories";
import {
  IsNotPastDateConstraint,
  IsEndDateAfterStartDateConstraint,
} from "./date.validators";

class MealDTO {
  @IsBoolean()
  breakfast!: boolean;

  @IsBoolean()
  lunch!: boolean;

  @IsBoolean()
  dinner!: boolean;
}

class ActivityDTO {
  @IsString()
  @IsNotEmpty({ message: "Activity name is required" })
  @MinLength(2, { message: "Activity name must be at least 2 characters" })
  @MaxLength(100, { message: "Activity name must not exceed 100 characters" })
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || "")
  description?: string;

  @IsNumber({}, { message: "Duration must be a number" })
  @Type(() => Number)
  @Min(1, { message: "Duration must be at least 1 minute" })
  duration!: number;

  @IsString()
  @IsNotEmpty({ message: "Activity category is required" })
  @MinLength(2, { message: "Category must be at least 2 characters" })
  @Transform(({ value }) => value?.trim())
  category!: string;

  @IsOptional()
  @IsBoolean()
  priceIncluded?: boolean;
}

class ItineraryDayDTO {
  @IsNumber({}, { message: "Day number must be a number" })
  @Type(() => Number)
  @Min(1, { message: "Day number must be at least 1" })
  dayNumber!: number;

  @IsString()
  @IsNotEmpty({ message: "Day title is required" })
  @MinLength(2, { message: "Day title must be at least 2 characters" })
  @MaxLength(200, { message: "Day title must not exceed 200 characters" })
  @Transform(({ value }) => value?.trim())
  title!: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || "")
  description?: string;

  @IsArray()
  @ArrayMinSize(1, { message: "At least one activity is required for each day" })
  @ValidateNested({ each: true })
  @Type(() => ActivityDTO)
  activities!: ActivityDTO[];

  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-z\s]*$/, {
    message: "Accommodation can only contain letters and spaces",
  })
  @Transform(({ value }) => value?.trim() || "")
  accommodation?: string;

  @ValidateNested()
  @Type(() => MealDTO)
  meals!: MealDTO;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  transfers?: string[];
}


export class CreatePackageRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Package name is required" })
  @MinLength(3, { message: "Package name must be at least 3 characters" })
  @MaxLength(100, { message: "Package name must not exceed 100 characters" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Package name can only contain alphabets and spaces",
  })
  @Transform(({ value }) => value?.trim())
  PackageName!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(10, { message: "Description must be at least 10 characters" })
  @MaxLength(1000, { message: "Description must not exceed 1000 characters" })
  @Transform(({ value }) => value?.trim())
  description!: string;

  @IsString()
  @IsNotEmpty({ message: "Category is required" })
  @Transform(({ value }) => {
    const raw = String(value ?? "").trim();
    const normalized = normalizePackageCategory(raw);
    return normalized ?? raw;
  })
  @IsIn(PACKAGE_CATEGORIES, {
    message:
      "category must be one of: Sightseeing, Adventure, Cultural, Spiritual, Wellness, Family, Honeymoon, Nature, Heritage, belief",
  })
  category!: PackageCategory;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty({ message: "Meeting point is required" })
  @MinLength(3, { message: "Meeting point must be at least 3 characters" })
  @MaxLength(200, { message: "Meeting point must not exceed 200 characters" })
  @Transform(({ value }) => value?.trim())
  meetingPoint!: string;

  @IsArray()
  @ArrayMinSize(1, { message: "At least one image is required" })
  @IsString({ each: true })
  images!: string[];

  @IsNumber({}, { message: "Max group size must be a number" })
  @Type(() => Number)
  @Min(1, { message: "Max group size must be at least 1" })
  maxGroupSize!: number;

  @IsNumber({}, { message: "Base price must be a number" })
  @Type(() => Number)
  @Min(0.01, { message: "Base price must be greater than 0" })
  basePrice!: number;

  @IsDateString({}, { message: "Start date must be a valid date string" })
  @Validate(IsNotPastDateConstraint)
  startDate!: string;

  @IsDateString({}, { message: "End date must be a valid date string" })
  @Validate(IsNotPastDateConstraint)
  @Validate(IsEndDateAfterStartDateConstraint)
  endDate!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclusions?: string[];

  @IsArray()
  @ArrayMinSize(1, { message: "At least one itinerary day is required" })
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDTO)
  itineraryDays!: ItineraryDayDTO[];
}

