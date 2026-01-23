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
} from "class-validator";
import { Type } from "class-transformer";

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
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(1)
  duration!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsBoolean()
  priceIncluded?: boolean;
}

class ItineraryDayDTO {
  @IsNumber()
  @Min(1)
  dayNumber!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDTO)
  activities!: ActivityDTO[]; // Changed from string[] to ActivityDTO[]

  @IsString()
  @IsNotEmpty()
  accommodation!: string;

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
  @IsNotEmpty()
  PackageName!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  meetingPoint!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(1)
  maxGroupSize!: number;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
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
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDTO)
  itineraryDays!: ItineraryDayDTO[];
}

