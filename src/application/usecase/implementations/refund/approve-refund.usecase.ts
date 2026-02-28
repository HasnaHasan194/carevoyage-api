import { inject, injectable } from "tsyringe";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IDBSession } from "../../../../infrastructure/interface/session.interface";
import { IApproveRefundUseCase } from "../../interfaces/refund/approve-refund.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import type { IDebitWalletUseCase } from "../../interfaces/wallet/debit-wallet.interface";
import type { ICreditWalletUseCase } from "../../interfaces/wallet/credit-wallet.interface";

@injectable()
export class ApproveRefundUseCase implements IApproveRefundUseCase {
  constructor(
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IDebitWalletUseCase")
    private readonly _debitWalletUseCase: IDebitWalletUseCase,
    @inject("ICreditWalletUseCase")
    private readonly _creditWalletUseCase: ICreditWalletUseCase,
    @inject("IDBSession")
    private readonly _dbSession: IDBSession
  ) {}

  async execute(agencyId: string, refundRequestId: string): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    const refundRequest = await this._refundRequestRepository.findById(
      refundRequestId
    );
    if (!refundRequest) {
      throw new NotFoundError("Refund request not found");
    }

    if (refundRequest.agencyId !== agencyId) {
      throw new ValidationError("Refund request does not belong to this agency");
    }

    if (refundRequest.status !== "PENDING") {
      // idempotent: already handled
      return;
    }

    const booking = await this._bookingRepository.findById(
      refundRequest.bookingId
    );
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    await this._dbSession.withTransaction(async () => {
      const session = this._dbSession.getSession();

      await this._debitWalletUseCase.execute(
        {
          ownerId: agencyId,
          ownerType: "AGENCY",
          amount: refundRequest.refundAmount,
          source: "REFUND",
          referenceId: refundRequest._id,
          description: `Refund approved for booking ${refundRequest.bookingId}`,
        },
        session
      );

      await this._creditWalletUseCase.execute(
        {
          ownerId: booking.clientId,
          ownerType: "USER",
          amount: refundRequest.refundAmount,
          source: "REFUND",
          referenceId: refundRequest._id,
          description: `Refund for booking ${refundRequest.bookingId}`,
        },
        session
      );

      await this._refundRequestRepository.updateById(refundRequest._id, {
        status: "APPROVED",
      }, session);

      await this._bookingRepository.updateById(booking._id, {
        status: "REFUNDED",
      }, session);
    });
  }
}

