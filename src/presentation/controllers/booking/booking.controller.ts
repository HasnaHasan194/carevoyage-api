import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ICreateBookingCheckoutUseCase } from "../../../application/usecase/interfaces/booking/create-booking-checkout.interface";
import { IGetPackageSpecialNeedsForBookingUseCase } from "../../../application/usecase/interfaces/booking/get-package-special-needs-for-booking.interface";
import { IPreviewBookingPriceUseCase } from "../../../application/usecase/interfaces/booking/preview-booking-price.interface";
import { IGetAvailableCaretakersForBookingUseCase } from "../../../application/usecase/interfaces/booking/get-available-caretakers-for-booking.interface";
import { IConfirmBookingSuccessUseCase } from "../../../application/usecase/interfaces/booking/confirm-booking-success.interface";
import { IListClientBookingsUseCase } from "../../../application/usecase/interfaces/booking/list-client-bookings.interface";
import { IGetClientBookingDetailUseCase } from "../../../application/usecase/interfaces/booking/get-client-booking-detail.interface";
import { ICancelClientBookingUseCase } from "../../../application/usecase/interfaces/booking/cancel-client-booking.interface";
import { IRequestRefundUseCase } from "../../../application/usecase/interfaces/refund/request-refund.interface";
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
    private readonly _confirmBookingSuccessUseCase: IConfirmBookingSuccessUseCase,
    @inject("IListClientBookingsUseCase")
    private readonly _listClientBookingsUseCase: IListClientBookingsUseCase,
    @inject("IGetClientBookingDetailUseCase")
    private readonly _getClientBookingDetailUseCase: IGetClientBookingDetailUseCase,
    @inject("ICancelClientBookingUseCase")
    private readonly _cancelClientBookingUseCase: ICancelClientBookingUseCase,
    @inject("IRequestRefundUseCase")
    private readonly _requestRefundUseCase: IRequestRefundUseCase
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

  async getMyBookings(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const rawPaymentType = req.query.paymentType as string | undefined;
    const paymentType: "all" | "normal" | "special" =
      rawPaymentType === "normal" || rawPaymentType === "special"
        ? rawPaymentType
        : "all";

    const bookings = await this._listClientBookingsUseCase.execute(
      req.user.id,
      paymentType
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Bookings retrieved",
      bookings
    );
  }

  async getBookingDetail(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const bookingId = (req.params as { bookingId?: string }).bookingId;
    if (!bookingId) {
      ResponseHelper.error(res, "Booking ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const rawPaymentType = req.query.paymentType as string | undefined;
    const paymentType: "all" | "normal" | "special" =
      rawPaymentType === "normal" || rawPaymentType === "special"
        ? rawPaymentType
        : "all";

    const detail = await this._getClientBookingDetailUseCase.execute(
      req.user.id,
      bookingId,
      paymentType
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Booking detail retrieved",
      detail
    );
  }

  async cancelBooking(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const bookingId = (req.params as { bookingId?: string }).bookingId;
    if (!bookingId) {
      ResponseHelper.error(res, "Booking ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { reason } = req.body as { reason?: string };

    await this._cancelClientBookingUseCase.execute(
      req.user.id,
      bookingId,
      reason
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Booking cancelled"
    );
  }

  async requestRefund(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const bookingId = (req.params as { bookingId?: string }).bookingId;
    if (!bookingId) {
      ResponseHelper.error(res, "Booking ID is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const refundRequest = await this._requestRefundUseCase.execute(
      req.user.id,
      bookingId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Refund request submitted",
      refundRequest
    );
  }
}
