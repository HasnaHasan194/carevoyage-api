export interface CreateBookingWalletPayResult {
  bookingId: string;
}

export interface ICreateBookingWalletPayUseCase {
  execute(
    clientId: string,
    data: {
      packageId: string;
      caretakerId?: string;
      specialNeedIds?: string[];
    }
  ): Promise<CreateBookingWalletPayResult>;
}

