import { inject, injectable } from "tsyringe";
import { ICreateAgencyReviewUseCase } from "../../interfaces/review/create-agency-review.interface";
import { IAgencyReviewEntity } from "../../../../domain/entities/agency-review.entity";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { NotificationService } from "../../../services/notification/notification.service";

@injectable()
export class CreateAgencyReviewUseCase implements ICreateAgencyReviewUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly bookingRepository: IBookingRepository,
    @inject("IAgencyReviewRepository")
    private readonly agencyReviewRepository: IAgencyReviewRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(params: {
    clientId: string;
    bookingId: string;
    rating: number;
    reviewText: string;
  }): Promise<IAgencyReviewEntity> {
    const { clientId, bookingId, rating, reviewText } = params;

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.REVIEW.NOT_FOUND);
    }

    if (booking.clientId !== clientId) {
      throw new ValidationError(ERROR_MESSAGE.REVIEW.CANNOT_REVIEW_OWN);
    }

    if (booking.status !== "COMPLETED") {
      throw new ValidationError(ERROR_MESSAGE.REVIEW.CANNOT_REVIEW_OWN);
    }

    const existing = await this.agencyReviewRepository.findByBookingId(bookingId);
    if (existing) {
      throw new ValidationError(ERROR_MESSAGE.REVIEW.ALREADY_EXISTS);
    }

    const created = await this.agencyReviewRepository.create({
      bookingId,
      agencyId: booking.agencyId,
      packageId: booking.packageId,
      clientId,
      rating,
      reviewText,
    });

    const agency = await this._agencyRepository.findById(booking.agencyId);
    if (agency) {
      await this._notificationService.createAndPublish({
        recipientUserId: agency.userId,
        recipientRole: "agency_owner",
        type: "REVIEW_CREATED",
        title: "New review received",
        message: "A client left a new review for your agency.",
        link: "/agency/reviews",
        metadata: {
          type: "REVIEW_CREATED",
          reviewId: created._id,
          bookingId,
          packageId: booking.packageId,
          rating,
        },
      });
    }

    return created;
  }
}
