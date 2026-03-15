import { inject, injectable } from "tsyringe";
import type {
  IListAgencyReviewsUseCase,
  ListAgencyReviewsResult,
} from "../../interfaces/review/list-agency-reviews.interface";
import { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 100;

function buildClientName(
  firstName: string | undefined,
  lastName: string | undefined,
  email: string
): string {
  const parts = [firstName, lastName].filter(Boolean).join(" ").trim();
  return parts || email || "Unknown";
}

@injectable()
export class ListAgencyReviewsUseCase implements IListAgencyReviewsUseCase {
  constructor(
    @inject("IAgencyReviewRepository")
    private readonly agencyReviewRepository: IAgencyReviewRepository,
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async execute(params: {
    agencyId: string;
    page: number;
    limit: number;
  }): Promise<ListAgencyReviewsResult> {
    const page = Math.max(1, params.page);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, params.limit || DEFAULT_LIMIT)
    );

    const [listResult, summary] = await Promise.all([
      this.agencyReviewRepository.listByAgency(params.agencyId, page, limit),
      this.agencyReviewRepository.getSummaryByAgency(params.agencyId),
    ]);

    const totalPages = Math.ceil(listResult.totalItems / limit) || 1;

    const items: ListAgencyReviewsResult["items"] = await Promise.all(
      listResult.items.map(async (r) => {
        const user = await this.userRepository.findById(r.clientId);
        const clientName = user
          ? buildClientName(user.firstName, user.lastName, user.email)
          : "Unknown";
        return {
          id: r._id,
          clientName,
          rating: r.rating,
          reviewText: r.reviewText,
          createdAt:
            r.createdAt instanceof Date
              ? r.createdAt.toISOString()
              : String(r.createdAt),
        };
      })
    );

    return {
      items,
      page,
      limit,
      totalItems: listResult.totalItems,
      totalPages,
      averageRating: summary.averageRating,
    };
  }
}
