import { IsNumber, Min } from "class-validator";

export class UpdateCaretakerPriceRequestDTO {
  @IsNumber()
  @Min(0)
  pricePerDay!: number;
}

