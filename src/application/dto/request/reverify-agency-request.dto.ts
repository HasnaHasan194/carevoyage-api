import { IsString, IsNotEmpty } from "class-validator";

export class ReverifyAgencyRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  token!: string;
}
