import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { VALIDATION_MESSAGE } from "../../../shared/constants/constants";

export class CreateCategoryRequestDTO {
  @IsString()
  @IsNotEmpty({ message: VALIDATION_MESSAGE.CATEGORY.NAME_REQUIRED })
  @MinLength(1, {
    message: VALIDATION_MESSAGE.GENERAL.MIN_LENGTH("Category name", 1),
  })
  @MaxLength(50, {
    message: VALIDATION_MESSAGE.GENERAL.MAX_LENGTH("Category name", 50),
  })
  name!: string;
}
