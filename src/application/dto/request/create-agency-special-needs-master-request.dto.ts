import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateAgencySpecialNeedsMasterRequestDTO {
  @IsString({ message: "Special need name must be a string" })
  @IsNotEmpty({ message: "Special need name is required" })
  @MinLength(2, {
    message: "Special need name must be at least 2 characters",
  })
  @MaxLength(100, {
    message: "Special need name must not exceed 100 characters",
  })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Special need name must contain only letters and spaces (no numbers or special characters)",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name!: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MaxLength(500, {
    message: "Description must not exceed 500 characters",
  })
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value?.trim()
  )
  description?: string;
}
