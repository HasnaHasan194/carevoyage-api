import { IsMongoId, IsNotEmpty } from "class-validator";

export class RequestCaretakerRequestDTO {
  @IsMongoId({ message: "Package ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Package ID is required" })
  packageId!: string;
}
