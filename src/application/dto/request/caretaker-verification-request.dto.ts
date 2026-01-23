import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class PersonalInfoDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: "First name must contain only letters" })
  @MinLength(2)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: "Last name must contain only letters" })
  @MinLength(2)
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
  phone!: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, { message: "Alternate phone must be exactly 10 digits" })
  alternatePhone?: string;

  @IsDateString()
  @IsNotEmpty()
  dob!: string;

  @IsEnum(["male", "female", "other"])
  @IsNotEmpty()
  gender!: "male" | "female" | "other";

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: "Nationality must contain only letters" })
  nationality!: string;
}

export class AddressInfoDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  street!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: "City must contain only letters" })
  city!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: "State must contain only letters" })
  state!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: "Country must contain only letters" })
  country!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: "Pin code must be numeric" })
  postalCode!: string;
}

export class ProfessionalInfoDTO {
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsNotEmpty()
  experienceYears!: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: "At least one language is required" })
  languages!: string[];

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(500)
  professionalBio!: string;
}

export class DocumentsDTO {
  @IsString()
  @IsNotEmpty()
  caretakerLicense!: string;

  @IsString()
  @IsNotEmpty()
  governmentIdProof!: string;

  @IsString()
  @IsNotEmpty()
  firstAidCertificate!: string;
}

export class CaretakerVerificationRequestDTO {
  @ValidateNested()
  @Type(() => PersonalInfoDTO)
  @IsNotEmpty()
  personalInfo!: PersonalInfoDTO;

  @ValidateNested()
  @Type(() => AddressInfoDTO)
  @IsNotEmpty()
  addressInfo!: AddressInfoDTO;

  @ValidateNested()
  @Type(() => ProfessionalInfoDTO)
  @IsNotEmpty()
  professionalInfo!: ProfessionalInfoDTO;

  @ValidateNested()
  @Type(() => DocumentsDTO)
  @IsNotEmpty()
  documents!: DocumentsDTO;
}

