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
  @IsOptional()
  breakfast?: boolean;

  @IsBoolean()
  @IsOptional()
  lunch?: boolean;

  @IsBoolean()
  @IsOptional()
  dinner?: boolean;
}

class ItineraryDayDTO {
  @IsNumber()
  @Min(1)
  @IsOptional()
  dayNumber?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  activities?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  accommodation?: string;

  @ValidateNested()
  @Type(() => MealDTO)
  @IsOptional()
  meals?: MealDTO;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  transfers?: string[];
}

export class UpdatePackageRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  PackageName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  meetingPoint?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxGroupSize?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
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
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDTO)
  @IsOptional()
  itineraryDays?: ItineraryDayDTO[];
}


