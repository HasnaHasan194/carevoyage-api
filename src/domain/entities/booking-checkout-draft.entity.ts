export type TBookingCheckoutDraftStatus = "PENDING" | "COMPLETED" | "EXPIRED";

export interface IBookingCheckoutDraftEntity {
  _id: string;
  clientId: string;
  packageId: string;
  agencyId: string;
  startDate: Date;
  endDate: Date;
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  totalAmount: number;
  currency: string;
  caretakerId?: string;
  selectedSpecialNeedIds?: string[];
  stripeSessionId?: string;
  status: TBookingCheckoutDraftStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

