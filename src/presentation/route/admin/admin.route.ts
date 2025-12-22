import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { adminUserController } from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { GetUsersRequestDTO } from "../../../application/dto/request/get-users-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { adminAuth } from "../../middlewares/adminAuth-middleware";

@injectable()
export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/users",
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetUsersRequestDTO),
      asyncHandler(adminUserController.getUsers.bind(adminUserController))
    );

    this.router.get(
      "/users/:userId",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.getUserDetails.bind(adminUserController))
    );

    this.router.patch(
      "/users/:userId/block",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.blockUser.bind(adminUserController))
    );

    this.router.patch(
      "/users/:userId/unblock",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.unblockUser.bind(adminUserController))
    );
  }
}

