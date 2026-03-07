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
import { GetSalesReportRequestDTO } from "../../../application/dto/request/get-sales-report-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { adminAuth } from "../../middlewares/adminAuth-middleware";
import { ROUTES } from "../routes.constants";

@injectable()
export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // User Management Routes
    this.router.get(
      ROUTES.ADMIN.USERS,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetUsersRequestDTO),
      asyncHandler(adminUserController.getUsers.bind(adminUserController))
    );

    this.router.get(
      ROUTES.ADMIN.USER_DETAIL,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.getUserDetails.bind(adminUserController))
    );

    this.router.patch(
      ROUTES.ADMIN.USER_BLOCK,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.blockUser.bind(adminUserController))
    );

    this.router.patch(
      ROUTES.ADMIN.USER_UNBLOCK,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminUserController.unblockUser.bind(adminUserController))
    );

    // Agency Management Routes
    this.router.get(
      ROUTES.ADMIN.AGENCIES,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetAgenciesRequestDTO),
      asyncHandler(adminAgencyController.getAgencies.bind(adminAgencyController))
    );

    this.router.get(
      ROUTES.ADMIN.AGENCY_DETAIL,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.getAgencyDetails.bind(adminAgencyController)
      )
    );

    this.router.patch(
      ROUTES.ADMIN.AGENCY_BLOCK,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(adminAgencyController.blockAgency.bind(adminAgencyController))
    );

    this.router.patch(
      ROUTES.ADMIN.AGENCY_UNBLOCK,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.unblockAgency.bind(adminAgencyController)
      )
    );

    this.router.patch(
      ROUTES.ADMIN.AGENCY_VERIFY,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminAgencyController.verifyAgency.bind(adminAgencyController)
      )
    );

    this.router.patch(
      ROUTES.ADMIN.AGENCY_REJECT,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(RejectAgencyRequestDTO),
      asyncHandler(
        adminAgencyController.rejectAgency.bind(adminAgencyController)
      )
    );

    // Wallet Transactions - Admin overview
    this.router.get(
      ROUTES.ADMIN.WALLET_TRANSACTIONS,
      asyncHandler(verifyAuth),
      adminAuth,
      asyncHandler(
        adminController.getWalletTransactions.bind(adminController)
      )
    );

    // Sales Report
    this.router.get(
      ROUTES.ADMIN.SALES_REPORT,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetSalesReportRequestDTO),
      asyncHandler(adminController.getSalesReport.bind(adminController))
    );
    this.router.get(
      ROUTES.ADMIN.SALES_REPORT_PDF,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetSalesReportRequestDTO),
      asyncHandler(adminController.getSalesReportPdf.bind(adminController))
    );
    this.router.get(
      ROUTES.ADMIN.SALES_REPORT_EXCEL,
      asyncHandler(verifyAuth),
      adminAuth,
      validationMiddleware(GetSalesReportRequestDTO),
      asyncHandler(adminController.getSalesReportExcel.bind(adminController))
    );
  }
}

