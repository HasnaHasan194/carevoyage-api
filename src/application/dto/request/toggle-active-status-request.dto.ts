import { IsBoolean, IsNotEmpty } from "class-validator";

export class ToggleActiveStatusRequestDTO {
  @IsBoolean({ message: "isActive must be a boolean value" })
  @IsNotEmpty({ message: "isActive is required" })
  isActive!: boolean;
}
