import type { IRefundRequestEntity } from "../../../../domain/entities/refund-request.entity";

export interface IListAgencyRefundRequestsUseCase {
  execute(agencyId: string): Promise<IRefundRequestEntity[]>;
}

