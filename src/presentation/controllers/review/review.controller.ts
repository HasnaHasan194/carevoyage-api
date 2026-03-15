import { inject, injectable } from "tsyringe";
import { Response } from "express";
import type { Request } from "express";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import { ICreateAgencyReviewUseCase } from "../../../application/usecase/interfaces/review/create-agency-review.interface";
import { IListAgencyReviewsUseCase } from "../../../application/usecase/interfaces/review/list-agency-reviews.interface";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;

@injectable()
export class ReviewController {
  constructor(
    @inject("ICreateAgencyReviewUseCase")
    private readonly createAgencyReviewUseCase: ICreateAgencyReviewUseCase,
    @inject("IListAgencyReviewsUseCase")
    private readonly listAgencyReviewsUseCase: IListAgencyReviewsUseCase,
    @inject("IAgencyRepository")
    private readonly agencyRepository: IAgencyRepository
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

    try {
      const { bookingId, rating, reviewText } = req.body as {
        bookingId: string;
        rating: number;
        reviewText: string;
      };

      const review = await this.createAgencyReviewUseCase.execute({
        clientId: req.user.id,
        bookingId,
        rating,
        reviewText,
      });

      ResponseHelper.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGE.REVIEW.CREATED,
        review
      );
    } catch (error: unknown) {
      const err = error as { message?: string; statusCode?: number };
      ResponseHelper.error(
        res,
        err.message ?? ERROR_MESSAGE.GENERAL.SERVER_ERROR,
        err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
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

    try {
      const agency = await this.agencyRepository.findByUserId(req.user.id);
      if (!agency) {
        ResponseHelper.error(
          res,
          ERROR_MESSAGE.AGENCY.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
        return;
      }

      const page = Math.max(1, parseInt(String((req as Request).query.page), 10) || DEFAULT_PAGE);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(String((req as Request).query.limit), 10) || DEFAULT_LIMIT)
      );

      const data = await this.listAgencyReviewsUseCase.execute({
        agencyId: agency._id,
        page,
        limit,
      });

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.REVIEW.FETCHED,
        data
      );
    } catch (error: unknown) {
      const err = error as { message?: string; statusCode?: number };
      ResponseHelper.error(
        res,
        err.message ?? ERROR_MESSAGE.GENERAL.SERVER_ERROR,
        err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
