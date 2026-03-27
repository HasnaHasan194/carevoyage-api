import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { blockedUserMiddleware, notificationController } from "../../../infrastructure/dependencyinjection/resolve";
import { ROUTES } from "../routes.constants";

@injectable()
export class NotificationRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(
      blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware)
    );

    this.router.get(
      ROUTES.NOTIFICATIONS.LIST,
      asyncHandler(notificationController.listMyNotifications.bind(notificationController))
    );

    this.router.patch(
      ROUTES.NOTIFICATIONS.MARK_READ,
      asyncHandler(notificationController.markRead.bind(notificationController))
    );

    this.router.patch(
      ROUTES.NOTIFICATIONS.MARK_ALL_READ,
      asyncHandler(notificationController.markAllRead.bind(notificationController))
    );
  }
}

