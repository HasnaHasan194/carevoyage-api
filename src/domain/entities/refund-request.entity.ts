export type TRefundRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IRefundRequestEntity {
  _id: string;
  bookingId: string;
  userId: string;
  agencyId: string;
  refundAmount: number;
  status: TRefundRequestStatus;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

