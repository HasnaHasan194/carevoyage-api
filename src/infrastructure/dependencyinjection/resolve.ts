import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { IErrorMiddleware } from "../../presentation/interfaces/controllers/auth/error-middleware.interface";
import { ErrorMiddleware } from "../../presentation/middlewares/error.middleware";
import { AuthController } from "../../presentation/controllers/auth/auth.controller";
import { IAuthController } from "../../presentation/interfaces/controllers/auth/auth.controller.interfaces";
import { AuthRoutes } from "../../presentation/route/auth/auth";
import { AdminUserController } from "../../presentation/controllers/admin/admin-user.controller";
import { IAdminUserController } from "../../presentation/interfaces/controllers/admin/admin-user.controller.interface";
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
import { CaretakerRoutes } from "../../presentation/route/caretaker/caretaker.route";
import { PackageController } from "../../presentation/controllers/package/package.controller";
import { PackageRoutes } from "../../presentation/route/package/package.route";

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
 * Agency routes
 */
export const agencyRoutes = container.resolve(AgencyRoutes);

/**
 * User routes
 */
export const userRoutes = container.resolve(UserRoutes);

/**
 * Caretaker Verification controller
 */
export const caretakerVerificationController = container.resolve(CaretakerVerificationController);

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
