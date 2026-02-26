import type { ClientBookingSummaryDTO } from "../../../dto/response/client-booking-response.dto";

export interface IListClientBookingsUseCase {
  execute(clientId: string): Promise<ClientBookingSummaryDTO[]>;
}

