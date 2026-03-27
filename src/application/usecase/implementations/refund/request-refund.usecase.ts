import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IRequestRefundUseCase } from "../../interfaces/refund/request-refund.interface";
import { RefundPolicyService } from "../../../services/refund-policy.service";
import type { IBookingEntity } from "../../../../domain/entities/booking.entity";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class RequestRefundUseCase implements IRequestRefundUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject(RefundPolicyService)
    private readonly _refundPolicyService: RefundPolicyService,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(userId: string, bookingId: string) {
    const booking = await this._bookingRepository.findByIdAndClientId(
      bookingId,
      userId
    );
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    if (booking.status !== "CANCELLED_BY_USER") {
      throw new ValidationError(
        ERROR_MESSAGE.BOOKING.CANNOT_CANCEL
      );
    }

    const existing = await this._refundRequestRepository.findByBookingId(
      bookingId
    );
    if (existing) {
      throw new ValidationError(ERROR_MESSAGE.REFUND.ALREADY_REQUESTED);
    }

    const now = new Date();
    let refundAmount =
      this._refundPolicyService.calculateRefundAmount(booking, now);


    if (!booking.startDate) {
      const pkg = await this._packageRepository.findById(booking.packageId);
      if (!pkg) {
        throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
      }
      const bookingWithStart: IBookingEntity = {
        ...booking,
        startDate: pkg.startDate,
      };
      refundAmount = this._refundPolicyService.calculateRefundAmount(
        bookingWithStart,
        now
      );
    }

    if (refundAmount <= 0) {
      throw new ValidationError(ERROR_MESSAGE.REFUND.NOT_ELIGIBLE);
    }

    const created = await this._refundRequestRepository.save({
      bookingId,
      userId,
      agencyId: booking.agencyId,
      refundAmount,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    });

    const agency = await this._agencyRepository.findById(booking.agencyId);
    if (agency) {
      await this._notificationService.createAndPublish({
        recipientUserId: agency.userId,
        recipientRole: "agency_owner",
        type: "BOOKING_REFUND_REQUESTED",
        title: "New refund request",
        message: "A client submitted a refund request.",
        link: "/agency/refund-requests",
        metadata: {
          type: "BOOKING_REFUND_REQUESTED",
          bookingId,
          refundRequestId: created._id,
        },
      });
    }

    return created;
  }
}

