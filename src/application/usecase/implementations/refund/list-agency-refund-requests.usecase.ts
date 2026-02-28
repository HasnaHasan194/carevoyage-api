import { inject, injectable } from "tsyringe";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IListAgencyRefundRequestsUseCase } from "../../interfaces/refund/list-agency-refund-requests.interface";

@injectable()
export class ListAgencyRefundRequestsUseCase
  implements IListAgencyRefundRequestsUseCase
{
  constructor(
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository
  ) {}

  async execute(agencyId: string) {
    return this._refundRequestRepository.findByAgencyId(agencyId);
  }
}

