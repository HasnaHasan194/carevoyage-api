export interface CreditBookingPayoutParams {
  bookingId: string;
  agencyId: string;
  totalAmount: number;
}

export interface ICreditBookingPayoutUseCase {
  execute(params: CreditBookingPayoutParams, session?: unknown): Promise<void>;
}
