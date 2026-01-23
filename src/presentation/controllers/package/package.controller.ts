import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { IBrowsePackagesUsecase } from "../../../application/usecase/interfaces/package/browse-packages.interface";
import { BrowsePackagesRequestDTO, SortOrder } from "../../../application/dto/request/browse-packages-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
@injectable()
export class PackageController {
  constructor(
    @inject("IBrowsePackagesUsecase")
    private readonly _browsePackagesUsecase: IBrowsePackagesUsecase
  ) {}

  async browsePackages(req: Request, res: Response): Promise<void> {
    const filters: BrowsePackagesRequestDTO = {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice
        ? Number(req.query.minPrice)
        : undefined,
      maxPrice: req.query.maxPrice
        ? Number(req.query.maxPrice)
        : undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      minDuration: req.query.minDuration
        ? Number(req.query.minDuration)
        : undefined,
      maxDuration: req.query.maxDuration
        ? Number(req.query.maxDuration)
        : undefined,
      sortBy: (req.query.sortBy as string) || "basePrice",
      sortOrder: (req.query.sortOrder === "desc" ? SortOrder.DESC : SortOrder.ASC),
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await this._browsePackagesUsecase.execute(filters);

    ResponseHelper.success(res, HTTP_STATUS.OK, "Packages retrieved successfully", result);
  }
}


