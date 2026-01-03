import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockedUserMiddleware,
  userController,
} from "../../../infrastructure/dependencyinjection/resolve";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser);

    this.router.get(
      "/profile",
      asyncHandler(userController.getProfile.bind(userController))
    );
  }
}
