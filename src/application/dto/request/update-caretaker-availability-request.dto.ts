import { IsIn } from "class-validator";

export class UpdateCaretakerAvailabilityRequestDTO {
  @IsIn(["AVAILABLE", "INACTIVE"], {
    message: "Status must be either AVAILABLE or INACTIVE",
  })
  status!: "AVAILABLE" | "INACTIVE";
}

