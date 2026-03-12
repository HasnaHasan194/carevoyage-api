import { inject, injectable } from "tsyringe";
import type { IListAgencyReviewsUseCase, ListAgencyReviewsParams } from "../../interfaces/review/list-agency-reviews.interface";
import type { PaginatedAgencyReviewsResponseDTO, AgencyReviewItemDTO } from "../../../dto/response/agency-review-response.dto";
import type { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import type { IAgencyReviewEntity } from "../../../../domain/entities/agency-review.entity";

@injectable()
export class ListAgencyReviewsUseCase implements IListAgencyReviewsUseCase {
  constructor(
    @inject("IAgencyReviewRepository")
    private readonly _agencyReviewRepository: IAgencyReviewRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository
  ) {}

  async execute(params: ListAgencyReviewsParams): Promise<PaginatedAgencyReviewsResponseDTO> {
    const safePage = params.page > 0 ? params.page : 1;
    const safeLimit = params.limit > 0 ? params.limit : 10;

    const [{ reviews, total }, summary] = await Promise.all([
      this._agencyReviewRepository.listByAgency(params.agencyId, safePage, safeLimit),
      this._agencyReviewRepository.getSummaryByAgency(params.agencyId),
    ]);

    const items = await this.enrichReviews(reviews);
    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

    return {
      reviews: items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      averageRating: summary.averageRating,
    };
  }

  private async enrichReviews(reviews: IAgencyReviewEntity[]): Promise<AgencyReviewItemDTO[]> {
    if (!reviews.length) {
      return [];
    }

    const bookingIds = new Set<string>();
    const clientIds = new Set<string>();
    const packageIds = new Set<string>();

    reviews.forEach((review) => {
      bookingIds.add(review.bookingId);
      clientIds.add(review.clientId);
      packageIds.add(review.packageId);
    });

    const [bookings, clients, packages] = await Promise.all([
      Promise.all(Array.from(bookingIds).map((id) => this._bookingRepository.findById(id))),
      Promise.all(Array.from(clientIds).map((id) => this._userRepository.findById(id))),
      Promise.all(Array.from(packageIds).map((id) => this._packageRepository.findById(id))),
    ]);

    const bookingById = new Map<string, NonNullable<(typeof bookings)[number]>>();
    bookings.forEach((booking) => {
      if (booking) {
        bookingById.set(booking._id, booking);
      }
    });

    const clientById = new Map<string, NonNullable<(typeof clients)[number]>>();
    clients.forEach((client) => {
      if (client) {
        clientById.set(client._id, client);
      }
    });

    const packageById = new Map<string, NonNullable<(typeof packages)[number]>>();
    packages.forEach((pkg) => {
      if (pkg) {
        packageById.set(pkg._id, pkg);
      }
    });

    const items: AgencyReviewItemDTO[] = reviews.map((review) => {
      const booking = bookingById.get(review.bookingId);
      const client = clientById.get(review.clientId);
      const pkg = packageById.get(review.packageId);

      const packageName = pkg?.PackageName ?? "Trip";
      const clientName = client
        ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || client.email
        : "Client";

      const startDateIso =
        booking?.startDate instanceof Date
          ? booking.startDate.toISOString()
          : new Date(booking?.startDate ?? new Date()).toISOString();
      const endDateIso =
        booking?.startDate instanceof Date && booking?.startDate
          ? booking.startDate.toISOString()
          : new Date(booking?.startDate ?? new Date()).toISOString();

      return {
        bookingId: review.bookingId,
        packageName,
        clientName,
        startDate: startDateIso,
        endDate: endDateIso,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt.toISOString(),
      };
    });

    return items;
  }
}

