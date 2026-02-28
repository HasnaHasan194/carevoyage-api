import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import {
  adminUserController,
  adminAgencyController,
  adminController,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { GetUsersRequestDTO } from "../../../application/dto/request/get-users-request.dto";
import { GetAgenciesRequestDTO } from "../../../application/dto/request/get-agencies-request.dto";
import { RejectAgencyRequestDTO } from "../../../application/dto/request/reject-agency-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { adminAuth } from "../../middlewares/adminAuth-middleware";

@injectable()
export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // User Management Routes
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

    // Agency Management Routes
    this.router.get(
      "/agencies",
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetAgenciesRequestDTO),
      asyncHandler(adminAgencyController.getAgencies.bind(adminAgencyController))
    );

    this.router.get(
      "/agencies/:agencyId",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.getAgencyDetails.bind(adminAgencyController)
      )
    );

    this.router.patch(
      "/agencies/:agencyId/block",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminAgencyController.blockAgency.bind(adminAgencyController))
    );

    this.router.patch(
      "/agencies/:agencyId/unblock",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.unblockAgency.bind(adminAgencyController)
      )
    );

    this.router.patch(
      "/agencies/:agencyId/verify",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.verifyAgency.bind(adminAgencyController)
      )
    );

    this.router.patch(
      "/agencies/:agencyId/reject",
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(RejectAgencyRequestDTO),
      asyncHandler(
        adminAgencyController.rejectAgency.bind(adminAgencyController)
      )
    );

    // Wallet Transactions - Admin overview
    this.router.get(
      "/wallet-transactions",
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminController.getWalletTransactions.bind(adminController)
      )
    );
  }
}

