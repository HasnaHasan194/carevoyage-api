import { inject, injectable } from "tsyringe";
import type {
  IListAgencyReviewsUseCase,
  ListAgencyReviewsResult,
} from "../../interfaces/review/list-agency-reviews.interface";
import type { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";

@injectable()
export class ListAgencyReviewsUseCase implements IListAgencyReviewsUseCase {
  constructor(
    @inject("IAgencyReviewRepository")
    private readonly _agencyReviewRepository: IAgencyReviewRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(params: {
    agencyId: string;
    page: number;
    limit: number;
  }): Promise<ListAgencyReviewsResult> {
    const { agencyId, page, limit } = params;

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 6;

    const [{ items, totalItems }, summary] = await Promise.all([
      this._agencyReviewRepository.listByAgency(agencyId, safePage, safeLimit),
      this._agencyReviewRepository.getSummaryByAgency(agencyId),
    ]);

    const usersById = new Map<string, string>();
    const results = await Promise.all(
      items.map(async (r) => {
        let clientName = usersById.get(r.clientId);
        if (!clientName) {
          const user = await this._userRepository.findById(r.clientId);
          clientName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
          usersById.set(r.clientId, clientName);
        }

        return {
          id: r._id,
          clientName,
          rating: r.rating,
          reviewText: r.reviewText,
          createdAt: r.createdAt.toISOString(),
        };
      })
    );

    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

    return {
      items: results,
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages,
      averageRating: summary.averageRating,
    };
  }
}

