import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IRefundRequestRepository } from "../../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IRequestRefundUseCase } from "../../interfaces/refund/request-refund.interface";
import { RefundPolicyService } from "../../../services/refund-policy.service";
import type { IBookingEntity } from "../../../../domain/entities/booking.entity";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class RequestRefundUseCase implements IRequestRefundUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IRefundRequestRepository")
    private readonly _refundRequestRepository: IRefundRequestRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject(RefundPolicyService)
    private readonly _refundPolicyService: RefundPolicyService
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

    return this._refundRequestRepository.save({
      bookingId,
      userId,
      agencyId: booking.agencyId,
      refundAmount,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    });
  }
}

