import type {
  ClientBookingSummaryDTO,
  PaymentBreakdownFilter,
} from "../../../dto/response/client-booking-response.dto";

export interface IListClientBookingsUseCase {
  execute(
    clientId: string,
    paymentType?: PaymentBreakdownFilter
  ): Promise<ClientBookingSummaryDTO[]>;
}

