export interface ClientBookingSummaryDTO {
  id: string;
  bookingId?: string;
  packageId: string;
  packageName: string;
  status: string;
  statusLabel: string;
  totalAmount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

/** Payment breakdown filter: all, normal (package + caretaker), or special (special needs only). */
export type PaymentBreakdownFilter = "all" | "normal" | "special";

export interface PaymentBreakdownLineItemDTO {
  label: string;
  amount: number;
}

export interface PaymentBreakdownItemDTO {
  type: "NORMAL" | "SPECIAL_NEEDS";
  label: string;
  amount: number;
  items: PaymentBreakdownLineItemDTO[];
}

export interface CaretakerSummaryInBookingDTO {
  id: string;
  name: string;
  profileImage?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  pricePerDay?: number;
  availabilityStatus: "AVAILABLE" | "BUSY" | "INACTIVE";
}

export interface ClientBookingDetailDTO extends ClientBookingSummaryDTO {
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  specialNeedIds?: string[];
  caretakerName?: string;
  caretakerProfileImage?: string;
  caretakerVerificationStatus?: string;
  packageDescription?: string;
  packageImages?: string[];
  meetingPoint?: string;
  canCancel: boolean;
  cancellationReason?: string;
  paymentBreakdown: PaymentBreakdownItemDTO[];
  caretaker?: CaretakerSummaryInBookingDTO;
}

