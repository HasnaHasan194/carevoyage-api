export interface ICaretakerProfileEntity {
  _id: string;
  userId?: string; 
  agencyId: string;
  email?: string; 
  nationality?: string;
  alternatePhone?: string;
  dob?: Date;
  languages: string[];
  experienceYears: number;
  profileImage?: string;
  documents: string[];
  status: "invited" | "active" | "blocked";
  verificationStatus?: "pending" | "verified" | "rejected";
  kycDocs: string[];
  rating: number;
  reviewCount: number;
  /**
   * High-level availability status used for booking:
   * - AVAILABLE: can be shown to clients for new bookings
   * - BUSY: currently assigned to an active trip (system-controlled)
   * - INACTIVE: temporarily unavailable (set by agency)
   */
  availabilityStatus: "AVAILABLE" | "BUSY" | "INACTIVE";
  /**
   * Soft delete flag – when true, caretaker is hidden from all flows
   * but record is kept for audit/history.
   */
  isDeleted: boolean;
  /** Price per day for booking (used in extended booking flow) */
  pricePerDay?: number;
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

