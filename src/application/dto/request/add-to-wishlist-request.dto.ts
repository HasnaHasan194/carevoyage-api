import { IsString, IsNotEmpty, IsMongoId } from "class-validator";

export class AddToWishlistRequestDTO {
  @IsString({ message: "Package ID must be a string" })
  @IsNotEmpty({ message: "Package ID is required" })
  @IsMongoId({ message: "Package ID must be a valid MongoDB ObjectId" })
  packageId!: string;
}
