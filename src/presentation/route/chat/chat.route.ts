import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { blockedUserMiddleware } from "../../../infrastructure/dependencyinjection/resolve";
import { ROUTES } from "../routes.constants";
import { chatController } from "../../../infrastructure/dependencyinjection/resolve";

@injectable()
export class ChatRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    this.router.get(
      ROUTES.CHAT.CONVERSATIONS,
      asyncHandler(chatController.listConversations.bind(chatController))
    );

    this.router.get(
      ROUTES.CHAT.BOOKING_MESSAGES,
      asyncHandler(chatController.getBookingMessages.bind(chatController))
    );
  }
}

