import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateBookingCheckoutRequestDTO } from "../../../application/dto/request/create-booking-checkout-request.dto";
import { PreviewBookingPriceRequestDTO } from "../../../application/dto/request/preview-booking-price-request.dto";
import { ConfirmBookingSuccessRequestDTO } from "../../../application/dto/request/confirm-booking-success-request.dto";
import { RequestCaretakerRequestDTO } from "../../../application/dto/request/request-caretaker-request.dto";
import { CancelBookingRequestDTO } from "../../../application/dto/request/cancel-booking-request.dto";
import { CreateBookingWalletPayRequestDTO } from "../../../application/dto/request/create-booking-wallet-pay-request.dto";
import {
  bookingController,
  blockedUserMiddleware,
} from "../../../infrastructure/dependencyinjection/resolve";
import { ROUTES } from "../routes.constants";

@injectable()
export class BookingRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    // Client booking checkout & pricing
    this.router.post(
      ROUTES.BOOKING.CHECKOUT,
      validationMiddleware(CreateBookingCheckoutRequestDTO),
      asyncHandler(bookingController.createCheckout.bind(bookingController))
    );

    this.router.post(
      ROUTES.BOOKING.WALLET_PAY,
      validationMiddleware(CreateBookingWalletPayRequestDTO),
      asyncHandler(bookingController.walletPay.bind(bookingController))
    );
    this.router.get(
      ROUTES.BOOKING.PACKAGE_SPECIAL_NEEDS,
      asyncHandler(bookingController.getPackageSpecialNeeds.bind(bookingController))
    );
    this.router.post(
      ROUTES.BOOKING.PRICE_PREVIEW,
      validationMiddleware(PreviewBookingPriceRequestDTO),
      asyncHandler(bookingController.previewPrice.bind(bookingController))
    );
    this.router.get(
      ROUTES.BOOKING.PACKAGE_CARETAKERS,
      asyncHandler(bookingController.getAvailableCaretakers.bind(bookingController))
    );

    // Stripe confirm success
    this.router.post(
      ROUTES.BOOKING.CONFIRM_SUCCESS,
      validationMiddleware(ConfirmBookingSuccessRequestDTO),
      asyncHandler(bookingController.confirmSuccess.bind(bookingController))
    );

    // Caretaker request from booking flow
    this.router.post(
      ROUTES.BOOKING.CARETAKER_REQUEST,
      validationMiddleware(RequestCaretakerRequestDTO),
      asyncHandler(bookingController.requestCaretaker.bind(bookingController))
    );

    // Client bookings: list, detail, cancel
    this.router.get(
      ROUTES.BOOKING.MY_BOOKINGS,
      asyncHandler(bookingController.getMyBookings.bind(bookingController))
    );

    this.router.get(
      ROUTES.BOOKING.DETAIL,
      asyncHandler(bookingController.getBookingDetail.bind(bookingController))
    );

    this.router.post(
      ROUTES.BOOKING.CANCEL,
      validationMiddleware(CancelBookingRequestDTO),
      asyncHandler(bookingController.cancelBooking.bind(bookingController))
    );

    this.router.post(
      ROUTES.BOOKING.REFUND_REQUEST,
      asyncHandler(bookingController.requestRefund.bind(bookingController))
    );
  }
}
