import { IBookingEntity } from "../../entities/booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  findByStripeSessionId(sessionId: string): Promise<IBookingEntity | null>;
}
