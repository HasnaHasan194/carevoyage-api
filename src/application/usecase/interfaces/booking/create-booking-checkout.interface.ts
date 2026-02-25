export interface CreateBookingCheckoutResult {
  url: string;
  sessionId: string;
  bookingId: string;
}

export interface ICreateBookingCheckoutUseCase {
  execute(
    clientId: string,
    data: {
      packageId: string;
      caretakerFee?: number;
      caretakerId?: string;
      specialNeedIds?: string[];
    }
  ): Promise<CreateBookingCheckoutResult>;
}
