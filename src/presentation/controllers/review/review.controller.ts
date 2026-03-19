import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IListAgencyReviewsUseCase } from "../../../application/usecase/interfaces/review/list-agency-reviews.interface";
import type { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants/constants";
import type { ICreateAgencyReviewUseCase } from "../../../application/usecase/interfaces/review/create-agency-review.interface";

const DEFAULT_LIMIT = 6;

@injectable()
export class ReviewController {
  constructor(
    @inject("IListAgencyReviewsUseCase")
    private readonly _listAgencyReviewsUseCase: IListAgencyReviewsUseCase,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("ICreateAgencyReviewUseCase")
    private readonly _createAgencyReviewUseCase: ICreateAgencyReviewUseCase
  ) {}

  private async getAgencyId(req: CustomRequest): Promise<string> {
    if (!req.user) {
      throw new NotFoundError(
        ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED
      );
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }
    return agency._id;
  }

  async listAgencyReviews(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agencyId = await this.getAgencyId(customReq);

    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.max(
      1,
      Number(req.query.limit ?? DEFAULT_LIMIT) || DEFAULT_LIMIT
    );

    const data = await this._listAgencyReviewsUseCase.execute({
      agencyId,
      page,
      limit,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }

  async createAgencyReview(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;

    if (!customReq.user) {
      throw new NotFoundError(
        ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED
      );
    }

    const { bookingId, rating, reviewText } = req.body as {
      bookingId: string;
      rating: number;
      reviewText: string;
    };

    const review = await this._createAgencyReviewUseCase.execute({
      clientId: customReq.user.id,
      bookingId,
      rating,
      reviewText,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: review,
    });
  }
}
 
