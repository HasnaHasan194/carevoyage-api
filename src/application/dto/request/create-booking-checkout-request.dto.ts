import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { VALIDATION_MESSAGE, ERROR_MESSAGE } from "../../../shared/constants/constants";

export class CreateBookingCheckoutRequestDTO {
  @IsMongoId({ message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Package ID") })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.GENERAL.REQUIRED("Package ID") })
  packageId!: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGE.GENERAL.MUST_BE_NUMBER("Caretaker fee") })
  @Min(0, { message: "Caretaker fee cannot be negative" })
  @Transform(({ value }) => (value === "" || value === null ? undefined : Number(value)))
  caretakerFee?: number;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGE.GENERAL.MUST_BE_STRING("Special need IDs") })
  @IsMongoId({
    each: true,
    message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Special need ID"),
  })
  specialNeedIds?: string[];

  /** When provided, caretakerFee is computed server-side from caretaker's pricePerDay * tripDays */
  @IsOptional()
  @IsMongoId({
    message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Caretaker ID"),
  })
  caretakerId?: string;
}
