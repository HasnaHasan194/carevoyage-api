import { inject, injectable } from "tsyringe";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IRejectRefundUseCase } from "../../interfaces/refund/reject-refund.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class RejectRefundUseCase implements IRejectRefundUseCase {
  constructor(
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
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

    await Promise.all([
      this._notificationService.createAndPublish({
        recipientUserId: refundRequest.userId,
        recipientRole: "client",
        type: "BOOKING_REFUND_REJECTED",
        title: "Refund rejected",
        message: reason?.trim()
          ? `Your refund request was rejected: ${reason.trim()}`
          : "Your refund request was rejected.",
        link: "/client/bookings",
        metadata: {
          type: "BOOKING_REFUND_REJECTED",
          bookingId: refundRequest.bookingId,
          refundRequestId: refundRequest._id,
          reason: reason?.trim() || undefined,
        },
      }),
      this._notificationService.createAndPublish({
        recipientUserId: agency.userId,
        recipientRole: "agency_owner",
        type: "BOOKING_REFUND_REJECTED",
        title: "Refund rejected",
        message: "You rejected a refund request.",
        link: "/agency/refund-requests",
        metadata: {
          type: "BOOKING_REFUND_REJECTED",
          bookingId: refundRequest.bookingId,
          refundRequestId: refundRequest._id,
          reason: reason?.trim() || undefined,
        },
      }),
    ]);
  }
}

