import { IBookingEntity } from "../../entities/booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findByStripeSessionId(sessionId: string): Promise<IBookingEntity | null>;
  findByPackageId(packageId: string): Promise<IBookingEntity[]>;
  findByClientId(clientId: string): Promise<IBookingEntity[]>;
  findByIdAndClientId(
    bookingId: string,
    clientId: string
  ): Promise<IBookingEntity | null>;
}
