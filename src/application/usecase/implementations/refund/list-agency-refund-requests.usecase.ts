import { inject, injectable } from "tsyringe";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import {
  IListAgencyRefundRequestsUseCase,
  type ListAgencyRefundRequestsParams,
  type ListAgencyRefundRequestsPaginatedResult,
} from "../../interfaces/refund/list-agency-refund-requests.interface";

@injectable()
export class ListAgencyRefundRequestsUseCase
  implements IListAgencyRefundRequestsUseCase
{
  constructor(
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository
  ) {}

  async execute(
    params: ListAgencyRefundRequestsParams
  ): Promise<ListAgencyRefundRequestsPaginatedResult> {
    const safePage = params.page > 0 ? params.page : 1;
    const safeLimit = params.limit > 0 ? params.limit : 10;

    const [requests, total] = await Promise.all([
      this._refundRequestRepository.findByAgencyIdPaginated(
        params.agencyId,
        safePage,
        safeLimit
      ),
      this._refundRequestRepository.countByAgencyId(params.agencyId),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

    return {
      requests,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}

