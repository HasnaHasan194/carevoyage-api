import { inject, injectable } from "tsyringe";
import { ISubmitCaretakerVerificationUsecase } from "../../interfaces/caretaker/submit-verification.interface";
import { CaretakerVerificationRequestDTO } from "../../../dto/request/caretaker-verification-request.dto";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class SubmitCaretakerVerificationUsecase
  implements ISubmitCaretakerVerificationUsecase
{
  constructor(
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    data: CaretakerVerificationRequestDTO
  ): Promise<void> {
    // Find caretaker profile
    const profile = await this._caretakerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Caretaker profile not found");
    }

    // Find user
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate age (must be >= 18)
    const dob = new Date(data.personalInfo.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new ValidationError("Age must be at least 18 years");
    }

    // Update USER entity with personal info (redundant fields)
    await this._userRepository.updateById(userId, {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      phone: data.personalInfo.phone,
      gender: data.personalInfo.gender,
      bio: data.professionalInfo.professionalBio, 
    });

    // Update CARETAKER PROFILE with only caretaker-specific fields
    await this._caretakerProfileRepository.updateById(profile._id, {
      alternatePhone: data.personalInfo.alternatePhone,
      dob: dob,
      nationality: data.personalInfo.nationality,
      address: {
        street: data.addressInfo.street,
        city: data.addressInfo.city,
        state: data.addressInfo.state,
        country: data.addressInfo.country,
        postalCode: data.addressInfo.postalCode,
      },
      experienceYears: data.professionalInfo.experienceYears,
      languages: data.professionalInfo.languages,
      kycDocs: [
        data.documents.caretakerLicense,
        data.documents.governmentIdProof,
        data.documents.firstAidCertificate,
      ],
      verificationStatus: "verified", 
    });
  }
}

