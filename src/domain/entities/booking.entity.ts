export type TBookingStatus =
  | "pending_payment"
  | "CONFIRMED"
  | "CANCELLED_BY_USER"
  | "REFUNDED";

export interface IBookingEntity {
  _id: string;
  clientId: string;
  packageId: string;
  agencyId: string;
  /** Trip start date copied from package at time of booking */
  startDate: Date;
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  totalAmount: number;
  currency: string;
  status: TBookingStatus;
  stripeSessionId?: string;
  paidAt?: Date;
  /** Optional client-provided reason when the booking was cancelled */
  cancellationReason?: string;
  /** Selected caretaker profile ID (extended booking flow) */
  caretakerId?: string;
  /** Special need IDs selected for this booking */
  selectedSpecialNeedIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
