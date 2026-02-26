import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import {
  type IListClientBookingsUseCase,
} from "../../interfaces/booking/list-client-bookings.interface";
import type { ClientBookingSummaryDTO } from "../../../dto/response/client-booking-response.dto";

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending_payment":
      return "Unpaid";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

@injectable()
export class ListClientBookingsUseCase implements IListClientBookingsUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository
  ) {}

  async execute(clientId: string): Promise<ClientBookingSummaryDTO[]> {
    const bookings = await this._bookingRepository.findByClientId(clientId);

    const result: ClientBookingSummaryDTO[] = [];

    for (const booking of bookings) {
      const pkg = await this._packageRepository.findById(booking.packageId);

      result.push({
        id: booking._id,
        packageId: booking.packageId,
        packageName: pkg?.PackageName ?? "Unknown package",
        status: booking.status,
        statusLabel: mapStatusToLabel(booking.status),
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        startDate: pkg?.startDate,
        endDate: pkg?.endDate,
        createdAt: booking.createdAt,
      });
    }

    return result;
  }
}

