import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class UpdateCategoryRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Category name is required" })
  @MinLength(1, { message: "Category name must be at least 1 character" })
  @MaxLength(50, { message: "Category name must not exceed 50 characters" })
  name!: string;
}
