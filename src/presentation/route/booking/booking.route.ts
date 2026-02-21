import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateBookingCheckoutRequestDTO } from "../../../application/dto/request/create-booking-checkout-request.dto";
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
    this.router.post(
      "/checkout",
      validationMiddleware(CreateBookingCheckoutRequestDTO),
      asyncHandler(bookingController.createCheckout.bind(bookingController))
    );
  }
}
