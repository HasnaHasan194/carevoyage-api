import {
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
  IsString,
  IsNotEmpty,
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

class ActivityDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsBoolean()
  priceIncluded?: boolean;

  @IsString()
  @IsOptional()
  id?: string;
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
  @ValidateNested({ each: true })
  @Type(() => ActivityDTO)
  @IsOptional()
  activities?: ActivityDTO[]; 

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

export class UpdatePackageItineraryDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDTO)
  @IsOptional()
  itineraryDays?: ItineraryDayDTO[];
}

