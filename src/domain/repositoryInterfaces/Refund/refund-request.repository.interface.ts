import { IRefundRequestEntity } from "../../entities/refund-request.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IRefundRequestRepository
  extends IBaseRepository<IRefundRequestEntity> {
  findByBookingId(bookingId: string): Promise<IRefundRequestEntity | null>;
  findByAgencyId(agencyId: string): Promise<IRefundRequestEntity[]>;
  findByAgencyIdPaginated(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<IRefundRequestEntity[]>;
  countByAgencyId(agencyId: string): Promise<number>;
}

