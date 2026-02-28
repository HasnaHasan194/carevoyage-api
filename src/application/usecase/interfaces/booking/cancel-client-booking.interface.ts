export interface ICancelClientBookingUseCase {
  execute(
    clientId: string,
    bookingId: string,
    reason?: string
  ): Promise<void>;
}

