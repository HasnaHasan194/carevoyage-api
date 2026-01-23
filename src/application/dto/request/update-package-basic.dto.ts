import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsDateString,
  IsOptional,
} from "class-validator";

export class UpdatePackageBasicDTO {
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
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

