export interface ICancelClientBookingUseCase {
  execute(clientId: string, bookingId: string): Promise<void>;
}

