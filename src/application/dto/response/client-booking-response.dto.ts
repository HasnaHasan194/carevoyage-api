export interface ClientBookingSummaryDTO {
  id: string;
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
  /** Filtered payment breakdown based on paymentType query param. */
  paymentBreakdown: PaymentBreakdownItemDTO[];
}

