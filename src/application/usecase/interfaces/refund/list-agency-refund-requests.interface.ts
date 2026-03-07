import type { IRefundRequestEntity } from "../../../../domain/entities/refund-request.entity";

export interface ListAgencyRefundRequestsParams {
  agencyId: string;
  page: number;
  limit: number;
}

export interface ListAgencyRefundRequestsPaginatedResult {
  requests: IRefundRequestEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListAgencyRefundRequestsUseCase {
  execute(
    params: ListAgencyRefundRequestsParams
  ): Promise<ListAgencyRefundRequestsPaginatedResult>;
}

