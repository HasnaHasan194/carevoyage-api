import { inject, injectable } from "tsyringe";
import { ISubmitCaretakerVerificationUsecase } from "../../interfaces/caretaker/submit-verification.interface";
import { CaretakerVerificationRequestDTO } from "../../../dto/request/caretaker-verification-request.dto";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

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
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND);
    }

    // Find user
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
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
      throw new ValidationError(ERROR_MESSAGE.CARETAKER.AGE_MUST_BE_18);
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

