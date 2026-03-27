import { inject, injectable } from "tsyringe";
import type { IListAgencyReviewsByPackageUseCase, ListAgencyReviewsByPackageResult } from "../../interfaces/review/list-agency-reviews-by-package.interface";
import type { IAgencyReviewRepository } from "../../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";

@injectable()
export class ListAgencyReviewsByPackageUseCase
  implements IListAgencyReviewsByPackageUseCase
{
  constructor(
    @inject("IAgencyReviewRepository")
    private readonly _agencyReviewRepository: IAgencyReviewRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository
  ) {}

  async execute(params: {
    agencyId: string;
    page: number;
    limit: number;
  }): Promise<ListAgencyReviewsByPackageResult> {
    const safePage =
      Number.isFinite(params.page) && params.page > 0 ? Math.floor(params.page) : 1;
    const safeLimit =
      Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : 6;

    const reviews = await this._agencyReviewRepository.listAllByAgency(params.agencyId);

    const usersById = new Map<string, string>();
    const grouped = new Map<string, typeof reviews>();

    for (const r of reviews) {
      const arr = grouped.get(r.packageId) ?? [];
      arr.push(r);
      grouped.set(r.packageId, arr);
    }

    const packageIds = Array.from(grouped.keys());
    const packages = packageIds.length
      ? await this._packageRepository.findByIds(packageIds)
      : [];
    const packageNameById = new Map<string, string>(
      packages.map((p) => [p._id, p.PackageName])
    );

    const packagesDto = await Promise.all(
      packageIds.map(async (packageId) => {
        const pkgReviews = grouped.get(packageId) ?? [];
        let sum = 0;

        const reviewItems = await Promise.all(
          pkgReviews.map(async (rev) => {
            sum += rev.rating;

            let clientName = usersById.get(rev.clientId);
            if (!clientName) {
              const user = await this._userRepository.findById(rev.clientId);
              clientName = user ? `${user.firstName} ${user.lastName}` : "Unknown";
              usersById.set(rev.clientId, clientName);
            }

            return {
              id: rev._id,
              clientName,
              rating: rev.rating,
              reviewText: rev.reviewText,
              createdAt: rev.createdAt.toISOString(),
            };
          })
        );

        const totalReviews = pkgReviews.length;
        const averageRating =
          totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;

        return {
          packageId,
          packageName: packageNameById.get(packageId) ?? "Unknown package",
          averageRating,
          totalReviews,
          reviews: reviewItems,
        };
      })
    );

    // Sort packages by most recent review date (desc)
    packagesDto.sort((a, b) => {
      const aDate = a.reviews[0]?.createdAt ?? "";
      const bDate = b.reviews[0]?.createdAt ?? "";
      return bDate.localeCompare(aDate);
    });

    const totalPackages = packagesDto.length;
    const totalPages = Math.max(1, Math.ceil(totalPackages / safeLimit));
    const start = (safePage - 1) * safeLimit;
    const pagePackages = packagesDto.slice(start, start + safeLimit);

    return {
      packages: pagePackages,
      totalPackages,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}

