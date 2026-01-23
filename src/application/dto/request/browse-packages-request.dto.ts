import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class BrowsePackagesRequestDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minDuration?: number; 

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxDuration?: number; 

  @IsOptional()
  @IsString()
  sortBy?: string = "basePrice";

  @IsOptional()
  @IsEnum(SortOrder, {
    message: "sortOrder must be one of: asc, desc",
  })
  sortOrder?: SortOrder = SortOrder.ASC;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}


