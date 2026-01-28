import {
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
} from "class-validator";

export class UpdateUserProfileRequestDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn(["male", "female", "other"], {
    message: "Gender must be one of: male, female, other",
  })
  gender?: "male" | "female" | "other";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string; 
}
