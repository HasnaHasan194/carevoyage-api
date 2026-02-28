import type { AgencyBookingDetailDTO } from "../../../dto/response/agency-booking-response.dto";

export interface IGetAgencyBookingDetailUseCase {
  execute(agencyId: string, bookingId: string): Promise<AgencyBookingDetailDTO>;
}

