export interface CaretakerProfileResponseDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  nationality?: string;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  experienceYears: number;
  languages: string[];
  professionalBio?: string;
  documents: {
    caretakerLicense?: string;
    governmentIdProof?: string;
    firstAidCertificate?: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  rating: number;
  reviewCount: number;
  joinedAt?: string;
}




