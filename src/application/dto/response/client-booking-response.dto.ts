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
}

