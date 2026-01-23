import { ICaretakerProfileEntity } from "../../domain/entities/caretaker-profile.entity";
import { IUserEntity } from "../../domain/entities/user.entity";
import { CaretakerProfileResponseDTO } from "../dto/response/caretaker-profile-response.dto";

export class CaretakerProfileResponseMapper {
  static toDTO(
    profile: ICaretakerProfileEntity,
    user: IUserEntity
  ): CaretakerProfileResponseDTO {
    // Helper function to validate and cast gender
    const getGender = (gender?: string): "male" | "female" | "other" | undefined => {
      if (!gender) return undefined;
      const genderLower = gender.toLowerCase();
      if (genderLower === "male" || genderLower === "female" || genderLower === "other") {
        return genderLower as "male" | "female" | "other";
      }
      return undefined;
    };
    // Map kycDocs array to documents object
    // Assuming kycDocs[0] = caretakerLicense, kycDocs[1] = governmentIdProof, kycDocs[2] = firstAidCertificate
    const documents: {
      caretakerLicense?: string;
      governmentIdProof?: string;
      firstAidCertificate?: string;
    } = {};

    if (profile.kycDocs && profile.kycDocs.length > 0) {
      // Try to match documents by checking if they contain keywords
      profile.kycDocs.forEach((doc) => {
        const docLower = doc.toLowerCase();
        if (docLower.includes("license") || docLower.includes("caretaker")) {
          documents.caretakerLicense = doc;
        } else if (docLower.includes("id") || docLower.includes("government") || docLower.includes("proof")) {
          documents.governmentIdProof = doc;
        } else if (docLower.includes("firstaid") || docLower.includes("cpr") || docLower.includes("certificate")) {
          documents.firstAidCertificate = doc;
        }
      });

      // If no matches found, assign in order
      if (!documents.caretakerLicense && profile.kycDocs[0]) {
        documents.caretakerLicense = profile.kycDocs[0];
      }
      if (!documents.governmentIdProof && profile.kycDocs[1]) {
        documents.governmentIdProof = profile.kycDocs[1];
      }
      if (!documents.firstAidCertificate && profile.kycDocs[2]) {
        documents.firstAidCertificate = profile.kycDocs[2];
      }
    }

    return {
      userId: profile.userId || "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      alternatePhone: profile.alternatePhone,
      gender: getGender(user.gender),
      dob: profile.dob ? profile.dob.toISOString().split("T")[0] : undefined,
      nationality: profile.nationality,
      profileImage: profile.profileImage || user.profileImage,
      address: profile.address,
      experienceYears: profile.experienceYears,
      languages: profile.languages,
      professionalBio: user.bio,
      documents,
      verificationStatus: profile.verificationStatus || "pending",
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      joinedAt: profile.joinedAt ? profile.joinedAt.toISOString() : undefined,
    };
  }
}

