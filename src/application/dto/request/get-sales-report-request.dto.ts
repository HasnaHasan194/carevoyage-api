import { IsOptional, IsDateString } from "class-validator";

export class GetSalesReportRequestDTO {
  @IsOptional()
  @IsDateString(
    {},
    { message: "startDate must be a valid ISO 8601 date string" }
  )
  startDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "endDate must be a valid ISO 8601 date string" }
  )
  endDate?: string;
}
