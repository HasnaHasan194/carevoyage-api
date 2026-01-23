import { IsArray, IsString, IsOptional } from "class-validator";

export class UpdatePackageImagesDTO {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]; // Array of S3 keys/URLs
}


