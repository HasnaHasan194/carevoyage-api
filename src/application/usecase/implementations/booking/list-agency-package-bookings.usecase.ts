import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IListAgencyPackageBookingsUseCase } from "../../interfaces/booking/list-agency-package-bookings.interface";
import type {
  AgencyBookingSummaryDTO,
  AgencyPackageBookingsPaginatedResponseDTO,
} from "../../../dto/response/agency-booking-response.dto";

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED_BY_USER":
      return "Cancelled by client";
    case "REFUNDED":
      return "Refunded";
    case "pending_payment":
      return "Pending payment";
    default:
      return status;
  }
}

@injectable()
export class ListAgencyPackageBookingsUseCase
  implements IListAgencyPackageBookingsUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    agencyId: string,
    packageId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AgencyPackageBookingsPaginatedResponseDTO> {
    const allBookings = await this._bookingRepository.findByAgencyIdAndPackageId(
      agencyId,
      packageId
    );

    const total = allBookings.length;
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;
    const bookings = allBookings.slice(startIndex, endIndex);

    const result: AgencyBookingSummaryDTO[] = [];

    for (const booking of bookings) {
      const pkg = await this._packageRepository.findById(booking.packageId);
      const user = await this._userRepository.findById(booking.clientId);

      result.push({
        id: booking._id,
        bookingId: booking.bookingId ?? booking._id,
        packageId: booking.packageId,
        packageName: pkg?.PackageName ?? "Unknown package",
        clientId: booking.clientId,
        clientName: user
          ? `${user.firstName} ${user.lastName}`.trim() || user.email
          : undefined,
        status: booking.status,
        statusLabel: mapStatusToLabel(booking.status),
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        startDate: pkg?.startDate,
        endDate: pkg?.endDate,
        createdAt: booking.createdAt,
      });
    }

    return {
      bookings: result,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }
}

