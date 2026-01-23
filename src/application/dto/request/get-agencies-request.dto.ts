import { IsOptional, IsInt, Min, IsString, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export enum AgencyStatusFilter {
  ALL = "all",
  BLOCKED = "blocked",
  UNBLOCKED = "unblocked",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class GetAgenciesRequestDTO {
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

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AgencyStatusFilter, {
    message: "Status must be one of: all, blocked, unblocked",
  })
  status?: AgencyStatusFilter = AgencyStatusFilter.ALL;

  @IsOptional()
  @IsString()
  sort?: string = "createdAt";

  @IsOptional()
  @IsEnum(SortOrder, {
    message: "Order must be one of: asc, desc",
  })
  order?: SortOrder = SortOrder.ASC;
}


