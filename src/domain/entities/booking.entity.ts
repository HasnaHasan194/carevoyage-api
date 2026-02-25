export type TBookingStatus = "pending_payment" | "paid" | "cancelled";

export interface IBookingEntity {
  _id: string;
  clientId: string;
  packageId: string;
  agencyId: string;
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  totalAmount: number;
  currency: string;
  status: TBookingStatus;
  stripeSessionId?: string;
  paidAt?: Date;
  /** Selected caretaker profile ID (extended booking flow) */
  caretakerId?: string;
  /** Special need IDs selected for this booking */
  selectedSpecialNeedIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
