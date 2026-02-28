export interface AgencyBookingSummaryDTO {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  clientId: string;
  clientName?: string;
  status: string;
  statusLabel: string;
  totalAmount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface AgencyBookingDetailDTO extends AgencyBookingSummaryDTO {
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
  cancellationReason?: string;
}

export interface AgencyPackageBookingsPaginatedResponseDTO {
  bookings: AgencyBookingSummaryDTO[];
  total: number;
  page: number;
  limit: number;
}

