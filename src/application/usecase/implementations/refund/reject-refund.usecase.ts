import { inject, injectable } from "tsyringe";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IRejectRefundUseCase } from "../../interfaces/refund/reject-refund.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class RejectRefundUseCase implements IRejectRefundUseCase {
  constructor(
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository
  ) {}

  async execute(
    agencyId: string,
    refundRequestId: string,
    reason?: string
  ): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    const refundRequest = await this._refundRequestRepository.findById(
      refundRequestId
    );
    if (!refundRequest) {
      throw new NotFoundError(ERROR_MESSAGE.REFUND.NOT_FOUND);
    }

    if (refundRequest.agencyId !== agencyId) {
      throw new ValidationError(ERROR_MESSAGE.REFUND.NOT_AGENCY_REQUEST);
    }

    if (refundRequest.status !== "PENDING") {
      return;
    }

    await this._refundRequestRepository.updateById(refundRequest._id, {
      status: "REJECTED",
      reason,
    });
  }
}

