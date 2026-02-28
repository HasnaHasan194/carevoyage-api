import { injectable } from "tsyringe";
import type { IBookingEntity } from "../../domain/entities/booking.entity";

@injectable()
export class RefundPolicyService {
  calculateRefundAmount(booking: IBookingEntity, now: Date): number {
    const tripStart = booking.startDate;
    if (!tripStart) return 0;

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor(
      (tripStart.getTime() - now.getTime()) / msPerDay
    );

    if (diffDays < 0) return 0;
    if (diffDays >= 10) return booking.totalAmount;
    if (diffDays >= 5) return booking.totalAmount * 0.8;
    if (diffDays >= 2) return booking.totalAmount * 0.5;
    return 0;
  }
}

