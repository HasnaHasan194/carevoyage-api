import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateBookingCheckoutRequestDTO } from "../../../application/dto/request/create-booking-checkout-request.dto";
import { PreviewBookingPriceRequestDTO } from "../../../application/dto/request/preview-booking-price-request.dto";
import { ConfirmBookingSuccessRequestDTO } from "../../../application/dto/request/confirm-booking-success-request.dto";
import { RequestCaretakerRequestDTO } from "../../../application/dto/request/request-caretaker-request.dto";
import {
  bookingController,
  blockedUserMiddleware,
} from "../../../infrastructure/dependencyinjection/resolve";

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
      "/checkout",
      validationMiddleware(CreateBookingCheckoutRequestDTO),
      asyncHandler(bookingController.createCheckout.bind(bookingController))
    );
    this.router.get(
      "/package/:packageId/special-needs",
      asyncHandler(bookingController.getPackageSpecialNeeds.bind(bookingController))
    );
    this.router.post(
      "/price-preview",
      validationMiddleware(PreviewBookingPriceRequestDTO),
      asyncHandler(bookingController.previewPrice.bind(bookingController))
    );
    this.router.get(
      "/package/:packageId/caretakers",
      asyncHandler(bookingController.getAvailableCaretakers.bind(bookingController))
    );

    // Stripe confirm success
    this.router.post(
      "/confirm-success",
      validationMiddleware(ConfirmBookingSuccessRequestDTO),
      asyncHandler(bookingController.confirmSuccess.bind(bookingController))
    );

    // Caretaker request from booking flow
    this.router.post(
      "/caretaker-request",
      validationMiddleware(RequestCaretakerRequestDTO),
      asyncHandler(bookingController.requestCaretaker.bind(bookingController))
    );

    // Client bookings: list, detail, cancel
    this.router.get(
      "/my",
      asyncHandler(bookingController.getMyBookings.bind(bookingController))
    );

    this.router.get(
      "/:bookingId",
      asyncHandler(bookingController.getBookingDetail.bind(bookingController))
    );

    this.router.post(
      "/:bookingId/cancel",
      asyncHandler(bookingController.cancelBooking.bind(bookingController))
    );
  }
}
