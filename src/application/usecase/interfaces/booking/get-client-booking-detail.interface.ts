import type { ClientBookingDetailDTO } from "../../../dto/response/client-booking-response.dto";

export interface IGetClientBookingDetailUseCase {
  execute(clientId: string, bookingId: string): Promise<ClientBookingDetailDTO>;
}

