import { IsOptional, IsString, IsMongoId, MaxLength } from "class-validator";

export class FulfillCaretakerRequestRequestDTO {
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: "Note must be at most 1000 characters" })
  noteToClient?: string;

  @IsOptional()
  @IsMongoId({ message: "Caretaker ID must be a valid MongoDB ObjectId" })
  caretakerId?: string;
}
