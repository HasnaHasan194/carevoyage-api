import { IsArray, IsString, ArrayMinSize } from "class-validator";

export class UpdatePackageImagesDTO {
  @IsArray()
  @ArrayMinSize(1, { message: "At least one image is required" })
  @IsString({ each: true })
  images!: string[]; // Array of S3 keys/URLs
}





