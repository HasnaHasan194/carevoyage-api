import { IBookingEntity } from "../../entities/booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findByStripeSessionId(sessionId: string): Promise<IBookingEntity | null>;
  findByPackageId(packageId: string): Promise<IBookingEntity[]>;
  findByClientId(clientId: string): Promise<IBookingEntity[]>;
  findByAgencyIdAndPackageId(
    agencyId: string,
    packageId: string
  ): Promise<IBookingEntity[]>;
  findByIdAndClientId(
    bookingId: string,
    clientId: string
  ): Promise<IBookingEntity | null>;
  findByIdAndAgencyId(
    bookingId: string,
    agencyId: string
  ): Promise<IBookingEntity | null>;
}
