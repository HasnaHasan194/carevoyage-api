export interface ICaretakerProfileEntity {
  _id: string;
  userId?: string;
  agencyId: string;
  email: string;
  nationality?: string;
  alternatePhone?: string;
  dob?: Date;
  languages: string[];
  experienceYears: number;
  profileImage?: string;
  documents: string[];
  status: "invited" | "active" | "blocked";
  kycDocs: string[];
  rating: number;
  reviewCount: number;
  joinedAt?: Date;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

