import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Transform } from "class-transformer";
import { VALIDATION_MESSAGE } from "../../../shared/constants/constants";

export class CreateWalletTopupCheckoutRequestDTO {
  @IsNotEmpty({ message: VALIDATION_MESSAGE.GENERAL.REQUIRED("Amount") })
  @IsNumber({}, { message: VALIDATION_MESSAGE.GENERAL.MUST_BE_NUMBER("Amount") })
  @Min(1, { message: "Amount must be greater than 0" })
  @Transform(({ value }) => (value === "" || value === null ? 0 : Number(value)))
  amount!: number;
}

