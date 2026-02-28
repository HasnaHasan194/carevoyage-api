import type { AgencyPackageBookingsPaginatedResponseDTO } from "../../../dto/response/agency-booking-response.dto";

export interface IListAgencyPackageBookingsUseCase {
  execute(
    agencyId: string,
    packageId: string,
    page?: number,
    limit?: number
  ): Promise<AgencyPackageBookingsPaginatedResponseDTO>;
}

