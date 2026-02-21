import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class UpdateAgencySpecialNeedsMasterRequestDTO {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Special need name must be at least 1 character" })
  @MaxLength(100, {
    message: "Special need name must not exceed 100 characters",
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "Description must not exceed 500 characters",
  })
  description?: string;
}
