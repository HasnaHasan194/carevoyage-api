import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { IBrowsePackagesUsecase } from "../../../application/usecase/interfaces/package/browse-packages.interface";
import { IGetUpcomingClientPackagesUsecase } from "../../../application/usecase/interfaces/package/get-upcoming-client-packages.interface";
import { BrowsePackagesRequestDTO, PackageSortKey, SortOrder } from "../../../application/dto/request/browse-packages-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

@injectable()
export class PackageController {
  constructor(
    @inject("IBrowsePackagesUsecase")
    private readonly _browsePackagesUsecase: IBrowsePackagesUsecase,
    @inject("IGetUpcomingClientPackagesUsecase")
    private readonly _getUpcomingClientPackagesUsecase: IGetUpcomingClientPackagesUsecase
  ) {}

  private getPageAndLimit(req: Request): { page: number; limit: number } {
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;
    const page = rawPage ? Math.max(1, parseInt(String(rawPage), 10) || 1) : 1;
    const limit = rawLimit ? Math.max(1, parseInt(String(rawLimit), 10) || 10) : 10;
    return { page, limit };
  }

  private buildBrowseFilters(req: Request): BrowsePackagesRequestDTO {
    const { page, limit } = this.getPageAndLimit(req);

    return {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      minDuration: req.query.minDuration ? Number(req.query.minDuration) : undefined,
      maxDuration: req.query.maxDuration ? Number(req.query.maxDuration) : undefined,
      sortKey: req.query.sortKey
        ? (String(req.query.sortKey) as PackageSortKey)
        : undefined,
      sortBy: (req.query.sortBy as string) || "basePrice",
      sortOrder:
        req.query.sortOrder === "desc" ? SortOrder.DESC : SortOrder.ASC,
      page,
      limit,
    };
  }

  async browsePackages(req: Request, res: Response): Promise<void> {
    const filters = this.buildBrowseFilters(req);

    const result = await this._browsePackagesUsecase.execute(filters);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PACKAGE.PACKAGES_RETRIEVED,
      result
    );
  }

  /**
   * Client-only: returns only upcoming packages (startDate > today).
   * Does not affect admin or agency APIs.
   */
  async getUpcomingPackages(req: Request, res: Response): Promise<void> {
    const { page, limit } = this.getPageAndLimit(req);

    const filters: Omit<BrowsePackagesRequestDTO, "startDate" | "endDate"> = {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minDuration: req.query.minDuration ? Number(req.query.minDuration) : undefined,
      maxDuration: req.query.maxDuration ? Number(req.query.maxDuration) : undefined,
      sortKey: req.query.sortKey
        ? (String(req.query.sortKey) as BrowsePackagesRequestDTO["sortKey"])
        : undefined,
      sortBy: (req.query.sortBy as string) || "basePrice",
      sortOrder:
        req.query.sortOrder === "desc" ? SortOrder.DESC : SortOrder.ASC,
      page,
      limit,
    };

    const result = await this._getUpcomingClientPackagesUsecase.execute(filters);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PACKAGE.UPCOMING_LIST_FETCHED ?? "Upcoming packages retrieved successfully",
      result
    );
  }
}


