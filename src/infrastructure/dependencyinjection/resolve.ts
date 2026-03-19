import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { IErrorMiddleware } from "../../presentation/interfaces/controllers/auth/error-middleware.interface";
import { ErrorMiddleware } from "../../presentation/middlewares/error.middleware";
import { AuthController } from "../../presentation/controllers/auth/auth.controller";
import { IAuthController } from "../../presentation/interfaces/controllers/auth/auth.controller.interfaces";
import { AuthRoutes } from "../../presentation/route/auth/auth";
import { AdminUserController } from "../../presentation/controllers/admin/admin-user.controller";
import { IAdminUserController } from "../../presentation/interfaces/controllers/admin/admin-user.controller.interface";
import { AdminController } from "../../presentation/controllers/admin/admin.controller";
import type { IAdminController } from "../../presentation/interfaces/controllers/admin/admin.controller.interface";
import { AdminAgencyController } from "../../presentation/controllers/admin/admin-agency.controller";
import { IAdminAgencyController } from "../../presentation/interfaces/controllers/admin/admin-agency.controller.interface";
import { AdminRoutes } from "../../presentation/route/admin/admin.route";
import { AgencyController } from "../../presentation/controllers/agency/agencycaretaker.controller";
import { IAgencyController } from "../../presentation/interfaces/controllers/agency/agency.controller.interface";
import { AgencyPackageController } from "../../presentation/controllers/agency/agency-package.controller";
import { IAgencyPackageController } from "../../presentation/interfaces/controllers/agency/agency-package.controller.interface";
import { AgencyActivityController } from "../../presentation/controllers/agency/agency-activity.controller";
import { IAgencyActivityController } from "../../presentation/interfaces/controllers/agency/agency-activity.controller.interface";
import { AgencyUploadController } from "../../presentation/controllers/agency/agency-upload.controller";
import { AgencyProfileController } from "../../presentation/controllers/agency/agency-profile.controller";
import { AgencyRoutes } from "../../presentation/route/agency/agency.route";
import { IBlockedUserMiddleware } from "../../presentation/interfaces/controllers/user/blocked-user.middleware.interface";
import { BlockedUserMiddleware } from "../../presentation/middlewares/block.middleware";
import { UserRoutes } from "../../presentation/route/user/user.route";
import { UserController } from "../../presentation/controllers/user/user-profile.controller";
import { IUserController } from "../../presentation/interfaces/controllers/user/user-profile.controller.interface";
import { ProfileUploadController } from "../../presentation/controllers/user/profile-upload.controller";
import { LoggerMiddleware } from "../../presentation/middlewares/logger.middleware";
import { CaretakerVerificationController } from "../../presentation/controllers/caretaker/caretaker-verification.controller";
import { ICaretakerDashboardController } from "../../presentation/interfaces/controllers/caretaker/caretaker-dashboard.controller.interface";
import { CaretakerDashboardController } from "../../presentation/controllers/caretaker/caretaker-dashboard.controller";
import { CaretakerRoutes } from "../../presentation/route/caretaker/caretaker.route";
import { PackageController } from "../../presentation/controllers/package/package.controller";
import { PackageRoutes } from "../../presentation/route/package/package.route";
import { BookingController } from "../../presentation/controllers/booking/booking.controller";
import { BookingRoutes } from "../../presentation/route/booking/booking.route";
import { PaymentController } from "../../presentation/controllers/payment/payment.controller";
import { WalletController } from "../../presentation/controllers/wallet/wallet.controller";
import { WalletRoutes } from "../../presentation/route/wallet/wallet.route";
import { AgencyCategoryRoutes } from "../../presentation/route/agency/agency-category.route";
import { IAgencyCategoryController } from "../../presentation/interfaces/controllers/agency/agency-category.controller.interface";
import { AgencyCategoryController } from "../../presentation/controllers/agency/agency-category.controller";
import { IAgencySpecialNeedsMasterController } from "../../presentation/interfaces/controllers/agency/agency-special-needs-master.controller.interface";
import { AgencySpecialNeedsMasterController } from "../../presentation/controllers/agency/agency-special-needs-master.controller";
import { AgencySpecialNeedsMasterRoutes } from "../../presentation/route/agency/agency-special-needs-master.route";
import { IAgencySpecialNeedsController } from "../../presentation/interfaces/controllers/agency/agency-special-needs.controller.interface";
import { AgencySpecialNeedsController } from "../../presentation/controllers/agency/agency-special-needs.controller";
import { AgencySpecialNeedsRoutes } from "../../presentation/route/agency/agency-special-needs.route";
import { IAgencySalesReportController } from "../../presentation/interfaces/controllers/agency/agency-sales-report.controller.interface";
import { AgencySalesReportController } from "../../presentation/controllers/agency/agency-sales-report.controller";
import { IWishlistController } from "../../presentation/interfaces/controllers/user/wishlist.controller.interface";
import { WishlistController } from "../../presentation/controllers/user/wishlist.controller";
import { ReviewController } from "../../presentation/controllers/review/review.controller";
import { ChatController } from "../../presentation/controllers/chat/chat.controller";
import { ChatRoutes } from "../../presentation/route/chat/chat.route";

DependencyInjection.registerAll();

export const errorMiddleware =
  container.resolve<IErrorMiddleware>(ErrorMiddleware);

  
/**
 * Blocked user middleware
 */
export const blockedUserMiddleware = container.resolve<IBlockedUserMiddleware>(
  BlockedUserMiddleware
);

export const userController =
  container.resolve<IUserController>(UserController);

/**
 * Profile Upload controller
 */
export const profileUploadController = container.resolve(ProfileUploadController);


/**
 * Auth controller
 */
export const authController =
  container.resolve<IAuthController>(AuthController);



/**
 * Auth routes
 */
export const authRoutes = container.resolve(AuthRoutes);

/**
 * Admin User controller
 */
export const adminUserController =
  container.resolve<IAdminUserController>(AdminUserController);

/**
 * Admin controller
 */
export const adminController =
  container.resolve<IAdminController>(AdminController);

/**
 * Admin Agency controller
 */
export const adminAgencyController =
  container.resolve<IAdminAgencyController>(AdminAgencyController);

/**
 * Admin routes
 */
export const adminRoutes = container.resolve(AdminRoutes);

/**
 * Agency controller
 */
export const agencyController =
  container.resolve<IAgencyController>(AgencyController);

/**
 * Agency Package controller
 */
export const agencyPackageController =
  container.resolve<IAgencyPackageController>(AgencyPackageController);

/**
 * Agency Activity controller
 */
export const agencyActivityController =
  container.resolve<IAgencyActivityController>(AgencyActivityController);

/**
 * Agency Upload controller
 */
export const agencyUploadController =
  container.resolve(AgencyUploadController);

/**
 * Agency Profile controller
 */
export const agencyProfileController =
  container.resolve(AgencyProfileController);

/**
 * Agency Category controller 
 */
export const agencyCategoryController =
  container.resolve<IAgencyCategoryController>(AgencyCategoryController);

/**
 * Agency Category routes 
 */
let agencyCategoryRoutes: AgencyCategoryRoutes;
try {
  agencyCategoryRoutes = container.resolve(AgencyCategoryRoutes);
} catch (error) {
  throw error;
}
export { agencyCategoryRoutes };

/**
 * Agency Special Needs Master controller 
 */
let agencySpecialNeedsMasterController: IAgencySpecialNeedsMasterController;
try {
  agencySpecialNeedsMasterController = container.resolve<IAgencySpecialNeedsMasterController>(
    AgencySpecialNeedsMasterController
  );
} catch (error) {
  throw error;
}
export { agencySpecialNeedsMasterController };

/**
 * Agency Special Needs Master routes - (Resolved after controller is fully exported)
 */
let agencySpecialNeedsMasterRoutes: AgencySpecialNeedsMasterRoutes;
try {
  agencySpecialNeedsMasterRoutes = container.resolve(
    AgencySpecialNeedsMasterRoutes
  );
} catch (error) {
  throw error;
}
export { agencySpecialNeedsMasterRoutes };

/**
 * Agency Special Needs controller
 */
export const agencySpecialNeedsController =
  container.resolve<IAgencySpecialNeedsController>(
    AgencySpecialNeedsController
  );

/**
 * Agency Special Needs routes
 */
let agencySpecialNeedsRoutes: AgencySpecialNeedsRoutes;
try {
  agencySpecialNeedsRoutes = container.resolve(AgencySpecialNeedsRoutes);
} catch (error) {
  throw error;
}
export { agencySpecialNeedsRoutes };

/**
 * Agency Sales Report controller
 */
export const agencySalesReportController =
  container.resolve<IAgencySalesReportController>(AgencySalesReportController);

/**
 * Review controller 
 */
export const reviewController = container.resolve(ReviewController);

/**
 * Agency routes
 */
export const agencyRoutes = container.resolve(AgencyRoutes);

/**
 * Wishlist controller 
 */
export const wishlistController = container.resolve<IWishlistController>(WishlistController);

/**
 * User routes 
 */
export const userRoutes = container.resolve(UserRoutes);

/**
 * Caretaker Verification controller
 */
export const caretakerVerificationController = container.resolve(CaretakerVerificationController);

/**
 * Caretaker Dashboard controller
 */
export const caretakerDashboardController =
  container.resolve<ICaretakerDashboardController>(CaretakerDashboardController);

/**
 * Caretaker routes
 */
export const caretakerRoutes = container.resolve(CaretakerRoutes);

/**
 * Loggermidddleware
 */
export const loggerMiddleware=container.resolve(LoggerMiddleware);

/**
 * Package controller
 */
export const packageController = container.resolve(PackageController);

/**
 * Package routes
 */
export const packageRoutes = container.resolve(PackageRoutes);

/**
 * Booking controller
 */
export const bookingController = container.resolve(BookingController);

/**
 * Booking routes
 */
export const bookingRoutes = container.resolve(BookingRoutes);

/**
 * Wallet controller
 */
export const walletController = container.resolve(WalletController);

/**
 * Wallet routes
 */
export const walletRoutes = container.resolve(WalletRoutes);

/**
 * Payment controller (for Stripe webhook)
 */
export const paymentController = container.resolve(PaymentController);

/**
 * Chat controller
 */
export const chatController = container.resolve(ChatController);

/**
 * Chat routes
 */
export const chatRoutes = container.resolve(ChatRoutes);
