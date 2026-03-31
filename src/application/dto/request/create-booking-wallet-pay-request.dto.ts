import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { VALIDATION_MESSAGE } from "../../../shared/constants/constants";

export class CreateBookingWalletPayRequestDTO {
  @IsMongoId({ message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Package ID") })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.GENERAL.REQUIRED("Package ID") })
  packageId!: string;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGE.GENERAL.MUST_BE_STRING("Special need IDs") })
  @IsMongoId({
    each: true,
    message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Special need ID"),
  })
  specialNeedIds?: string[];

  @IsOptional()
  @IsMongoId({
    message: VALIDATION_MESSAGE.ID.MUST_BE_MONGODB_ID("Caretaker ID"),
  })
  caretakerId?: string;
}

