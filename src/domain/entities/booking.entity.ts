export type TBookingStatus =
  | "pending_payment"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED_BY_USER"
  | "REFUNDED";

export interface IBookingEntity {
  _id: string;
  /** User-readable booking code (e.g. BKG-7F3A92). */
  bookingId?: string;
  clientId: string;
  packageId: string;
  agencyId: string;
  startDate: Date;
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  totalAmount: number;
  currency: string;
  status: TBookingStatus;
  stripeSessionId?: string;
  paidAt?: Date;
  cancellationReason?: string;
  caretakerId?: string;
  selectedSpecialNeedIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
