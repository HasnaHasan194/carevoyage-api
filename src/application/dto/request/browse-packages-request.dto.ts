import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsIn,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import {
  PACKAGE_CATEGORIES,
  normalizePackageCategory,
} from "../../../domain/constants/package-categories";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum PackageSortKey {
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  NEWEST = "newest",
  OLDEST = "oldest",
  DURATION_ASC = "duration_asc",
  DURATION_DESC = "duration_desc",
}

export class BrowsePackagesRequestDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value == null) return undefined;
    const raw = String(value).trim();
    const normalized = normalizePackageCategory(raw);
    return normalized ?? raw;
  })
  @IsIn(PACKAGE_CATEGORIES, {
    message:
      "category must be one of: Sightseeing, Adventure, Cultural, Spiritual, Wellness, Family, Honeymoon, Nature, Heritage, belief",
  })
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

  /**
   * Preferred sorting API (OCP-friendly):
   * - price_asc, price_desc
   * - newest, oldest
   * - duration_asc, duration_desc (duration computed as endDate - startDate)
   *
   * If provided, this overrides sortBy/sortOrder while keeping backward compatibility.
   */
  @IsOptional()
  @IsEnum(PackageSortKey, {
    message:
      "sortKey must be one of: price_asc, price_desc, newest, oldest, duration_asc, duration_desc",
  })
  sortKey?: PackageSortKey;

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



