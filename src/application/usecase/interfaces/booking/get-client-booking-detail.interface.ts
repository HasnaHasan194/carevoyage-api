import type {
  ClientBookingDetailDTO,
  PaymentBreakdownFilter,
} from "../../../dto/response/client-booking-response.dto";

export interface IGetClientBookingDetailUseCase {
  execute(
    clientId: string,
    bookingId: string,
    paymentType?: PaymentBreakdownFilter
  ): Promise<ClientBookingDetailDTO>;
}

