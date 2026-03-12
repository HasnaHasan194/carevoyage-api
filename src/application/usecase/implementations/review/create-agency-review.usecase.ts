import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import type { CreateAgencyReviewInput, ICreateAgencyReviewUseCase } from "../../interfaces/review/create-agency-review.interface";

@injectable()
export class CreateAgencyReviewUseCase implements ICreateAgencyReviewUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IAgencyReviewRepository")
    private readonly _agencyReviewRepository: IAgencyReviewRepository
  ) {}

  async execute(input: CreateAgencyReviewInput): Promise<void> {
    const booking = await this._bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    if (booking.clientId !== input.userId) {
      throw new ValidationError(ERROR_MESSAGE.GENERAL.FORBIDDEN);
    }

    if (booking.status !== "COMPLETED") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.INVALID_STATUS);
    }

    const existingReview = await this._agencyReviewRepository.findByBookingId(input.bookingId);
    if (existingReview) {
      throw new ValidationError(ERROR_MESSAGE.REVIEW.ALREADY_EXISTS);
    }

    await this._agencyReviewRepository.save({
      _id: "",
      bookingId: booking._id,
      agencyId: booking.agencyId,
      packageId: booking.packageId,
      clientId: booking.clientId,
      rating: input.rating,
      reviewText: input.reviewText,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

