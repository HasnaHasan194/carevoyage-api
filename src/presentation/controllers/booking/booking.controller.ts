import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ICreateBookingCheckoutUseCase } from "../../../application/usecase/interfaces/booking/create-booking-checkout.interface";
import { IGetPackageSpecialNeedsForBookingUseCase } from "../../../application/usecase/interfaces/booking/get-package-special-needs-for-booking.interface";
import { IPreviewBookingPriceUseCase } from "../../../application/usecase/interfaces/booking/preview-booking-price.interface";
import { IGetAvailableCaretakersForBookingUseCase } from "../../../application/usecase/interfaces/booking/get-available-caretakers-for-booking.interface";
import { IConfirmBookingSuccessUseCase } from "../../../application/usecase/interfaces/booking/confirm-booking-success.interface";
import { ICreateCaretakerRequestUseCase } from "../../../application/usecase/interfaces/caretaker-request/create-caretaker-request.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

@injectable()
export class BookingController {
  constructor(
    @inject("ICreateBookingCheckoutUseCase")
    private readonly _createBookingCheckoutUseCase: ICreateBookingCheckoutUseCase,
    @inject("ICreateCaretakerRequestUseCase")
    private readonly _createCaretakerRequestUseCase: ICreateCaretakerRequestUseCase,
    @inject("IGetPackageSpecialNeedsForBookingUseCase")
    private readonly _getPackageSpecialNeedsUseCase: IGetPackageSpecialNeedsForBookingUseCase,
    @inject("IPreviewBookingPriceUseCase")
    private readonly _previewBookingPriceUseCase: IPreviewBookingPriceUseCase,
    @inject("IGetAvailableCaretakersForBookingUseCase")
    private readonly _getAvailableCaretakersUseCase: IGetAvailableCaretakersForBookingUseCase,
    @inject("IConfirmBookingSuccessUseCase")
    private readonly _confirmBookingSuccessUseCase: IConfirmBookingSuccessUseCase
  ) {}

  async createCheckout(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const { packageId, caretakerFee, caretakerId, specialNeedIds } = req.body as {
      packageId: string;
      caretakerFee?: number;
      caretakerId?: string;
      specialNeedIds?: string[];
    };

    const result = await this._createBookingCheckoutUseCase.execute(
      req.user.id,
      { packageId, caretakerFee, caretakerId, specialNeedIds }
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Checkout session created",
      result
    );
  }

  async getPackageSpecialNeeds(req: CustomRequest, res: Response): Promise<void> {
    const packageId = req.params.packageId;
    if (!packageId) {
      ResponseHelper.error(res, "Package ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }
    const list = await this._getPackageSpecialNeedsUseCase.execute(packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special needs retrieved",
      list
    );
  }

  async previewPrice(req: CustomRequest, res: Response): Promise<void> {
    const { packageId, specialNeedIds, caretakerId } = req.body as {
      packageId: string;
      specialNeedIds?: string[];
      caretakerId?: string;
    };
    const result = await this._previewBookingPriceUseCase.execute({
      packageId,
      specialNeedIds,
      caretakerId,
    });
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Price preview",
      result
    );
  }

  async getAvailableCaretakers(req: CustomRequest, res: Response): Promise<void> {
    const packageId = req.params.packageId;
    if (!packageId) {
      ResponseHelper.error(res, "Package ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }
    const list = await this._getAvailableCaretakersUseCase.execute(packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Available caretakers retrieved",
      list
    );
  }

  async confirmSuccess(req: CustomRequest, res: Response): Promise<void> {
    const sessionId = (req.body as { sessionId?: string }).sessionId ?? (req.query as { session_id?: string }).session_id;
    if (!sessionId || typeof sessionId !== "string") {
      ResponseHelper.error(res, "Session ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }
    await this._confirmBookingSuccessUseCase.execute(sessionId);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Booking confirmed");
  }

  async requestCaretaker(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }
    const { packageId } = req.body as { packageId: string };
    if (!packageId) {
      ResponseHelper.error(res, "Package ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }
    await this._createCaretakerRequestUseCase.execute(req.user.id, packageId);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Caretaker request sent. The agency will be notified.");
  }
}
