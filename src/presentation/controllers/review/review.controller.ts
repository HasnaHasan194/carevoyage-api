import { inject, injectable } from "tsyringe";
import type { Response } from "express";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import type { ICreateAgencyReviewUseCase } from "../../../application/usecase/interfaces/review/create-agency-review.interface";
import type { IListAgencyReviewsUseCase } from "../../../application/usecase/interfaces/review/list-agency-reviews.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import type { IReviewController } from "../../interfaces/controllers/review/review.controller.interface";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject("ICreateAgencyReviewUseCase")
    private readonly _createAgencyReviewUseCase: ICreateAgencyReviewUseCase,
    @inject("IListAgencyReviewsUseCase")
    private readonly _listAgencyReviewsUseCase: IListAgencyReviewsUseCase
  ) {}

  async createAgencyReview(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    if (req.user.role !== "client") {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.FORBIDDEN,
        HTTP_STATUS.FORBIDDEN
      );
      return;
    }

    const { bookingId, rating, reviewText } = req.body as {
      bookingId: string;
      rating: number;
      reviewText: string;
    };

    await this._createAgencyReviewUseCase.execute({
      bookingId,
      rating,
      reviewText,
      userId: req.user.id,
    });

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.REVIEW.CREATED,
      null
    );
  }

  async listAgencyReviews(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    if (req.user.role !== "agency_owner") {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.FORBIDDEN,
        HTTP_STATUS.FORBIDDEN
      );
      return;
    }

    const agencyId = req.user.id;
    const pageRaw = req.query.page as string | undefined;
    const limitRaw = req.query.limit as string | undefined;
    const page = pageRaw ? Number(pageRaw) : 1;
    const limit = limitRaw ? Number(limitRaw) : 10;

    const data = await this._listAgencyReviewsUseCase.execute({
      agencyId,
      page,
      limit,
    });

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.REVIEW.FETCHED,
      data
    );
  }
}

