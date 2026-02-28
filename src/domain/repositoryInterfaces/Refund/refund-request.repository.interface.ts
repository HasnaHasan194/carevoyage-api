import { IRefundRequestEntity } from "../../entities/refund-request.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IRefundRequestRepository
  extends IBaseRepository<IRefundRequestEntity> {
  findByBookingId(bookingId: string): Promise<IRefundRequestEntity | null>;
  findByAgencyId(agencyId: string): Promise<IRefundRequestEntity[]>;
}

