import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ICaretakerDashboardController } from "../../interfaces/controllers/caretaker/caretaker-dashboard.controller.interface";
import type { IGetCaretakerDashboardUseCase } from "../../../application/usecase/interfaces/caretaker/get-caretaker-dashboard.interface";
import type { IListCaretakerTripsUseCase } from "../../../application/usecase/interfaces/caretaker/list-caretaker-trips.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { ERROR_MESSAGE } from "../../../shared/constants/constants";

@injectable()
export class CaretakerDashboardController
  implements ICaretakerDashboardController
{
  constructor(
    @inject("IGetCaretakerDashboardUseCase")
    private readonly _getDashboardUseCase: IGetCaretakerDashboardUseCase,
    @inject("IListCaretakerTripsUseCase")
    private readonly _listTripsUseCase: IListCaretakerTripsUseCase
  ) {}

  private getUserId(req: Request): string {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new Error(ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED);
    }
    return customReq.user.id;
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const data = await this._getDashboardUseCase.execute(userId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }

  async getTrips(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const data = await this._listTripsUseCase.execute({
      userId,
      page,
      limit,
    });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }
}
