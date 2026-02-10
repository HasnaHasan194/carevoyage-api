import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateAgencyProfileRequestDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Company name must be at least 2 characters" })
  @MaxLength(100, { message: "Company name must not exceed 100 characters" })
  @Transform(({ value }) => value?.trim())
  agencyName?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, v) => v !== "" && v != null)
  @MaxLength(20, { message: "Phone number must not exceed 20 characters" })
  @Matches(/^[0-9]{10,15}$/, {
    message: "Phone number must be 10-15 digits only",
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Address must be at least 5 characters" })
  @MaxLength(300, { message: "Address must not exceed 300 characters" })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Description must not exceed 500 characters" })
  @Transform(({ value }) => value?.trim())
  description?: string;
}
