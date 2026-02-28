import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import {
  type IListClientBookingsUseCase,
} from "../../interfaces/booking/list-client-bookings.interface";
import type {
  ClientBookingSummaryDTO,
  PaymentBreakdownFilter,
} from "../../../dto/response/client-booking-response.dto";

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED_BY_USER":
      return "Cancelled by you";
    case "REFUNDED":
      return "Refunded";
    case "pending_payment":
      return "Processing payment";
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

  async execute(
    clientId: string,
    paymentType: PaymentBreakdownFilter = "all"
  ): Promise<ClientBookingSummaryDTO[]> {
    const bookings = await this._bookingRepository.findByClientId(clientId);

    const filtered =
      paymentType === "normal"
        ? bookings.filter((b) => b.specialNeedsFee === 0)
        : paymentType === "special"
          ? bookings.filter((b) => b.specialNeedsFee > 0)
          : bookings;

    const result: ClientBookingSummaryDTO[] = [];

    for (const booking of filtered) {
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

