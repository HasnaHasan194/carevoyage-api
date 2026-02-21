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
  createdAt: Date;
  updatedAt: Date;
}
