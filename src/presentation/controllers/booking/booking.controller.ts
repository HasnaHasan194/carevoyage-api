import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ICreateBookingCheckoutUseCase } from "../../../application/usecase/interfaces/booking/create-booking-checkout.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

@injectable()
export class BookingController {
  constructor(
    @inject("ICreateBookingCheckoutUseCase")
    private readonly _createBookingCheckoutUseCase: ICreateBookingCheckoutUseCase
  ) {}

  async createCheckout(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const { packageId, caretakerFee, specialNeedIds } = req.body as {
      packageId: string;
      caretakerFee?: number;
      specialNeedIds?: string[];
    };

    const result = await this._createBookingCheckoutUseCase.execute(
      req.user.id,
      { packageId, caretakerFee, specialNeedIds }
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Checkout session created",
      result
    );
  }
}
