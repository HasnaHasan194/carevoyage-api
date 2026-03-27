import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import type { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants/constants";
import type { IListAgencyReviewsByPackageUseCase } from "../../../application/usecase/interfaces/review/list-agency-reviews-by-package.interface";

@injectable()
export class AgencyReviewsByPackageController {
  constructor(
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IListAgencyReviewsByPackageUseCase")
    private readonly _listAgencyReviewsByPackageUseCase: IListAgencyReviewsByPackageUseCase
  ) {}

  private async getAgencyId(req: CustomRequest): Promise<string> {
    if (!req.user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED);
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }
    return agency._id;
  }

  async listAgencyReviewsByPackage(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agencyId = await this.getAgencyId(customReq);

    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.max(1, Number(req.query.limit ?? 6) || 6);

    const data = await this._listAgencyReviewsByPackageUseCase.execute({
      agencyId,
      page,
      limit,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }
}

