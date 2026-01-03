import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { IErrorMiddleware } from "../../presentation/interfaces/controllers/auth/error-middleware.interface";
import { ErrorMiddleware } from "../../presentation/middlewares/error.middleware";
import { AuthController } from "../../presentation/controllers/auth/auth.controller";
import { IAuthController } from "../../presentation/interfaces/controllers/auth/auth.controller.interfaces";
import { AuthRoutes } from "../../presentation/route/auth/auth";
import { AdminUserController } from "../../presentation/controllers/admin/admin-user.controller";
import { IAdminUserController } from "../../presentation/interfaces/controllers/admin/admin-user.controller.interface";
import { AdminRoutes } from "../../presentation/route/admin/admin.route";
import { AgencyController } from "../../presentation/controllers/agency/agency.controller";
import { IAgencyController } from "../../presentation/interfaces/controllers/agency/agency.controller.interface";
import { AgencyRoutes } from "../../presentation/route/agency/agency.route";
import { IBlockedUserMiddleware } from "../../presentation/interfaces/controllers/user/blocked-user.middleware.interface";
import { BlockedUserMiddleware } from "../../presentation/middlewares/block.middleware";
import { UserRoutes } from "../../presentation/route/user/user.route";
import { UserController } from "../../presentation/controllers/user/user-profile.controller";
import { IUserController } from "../../presentation/interfaces/controllers/user/user-profile.controller.interface";

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
 * Admin routes
 */
export const adminRoutes = container.resolve(AdminRoutes);

/**
 * Agency controller
 */
export const agencyController =
  container.resolve<IAgencyController>(AgencyController);

/**
 * Agency routes
 */
export const agencyRoutes = container.resolve(AgencyRoutes);

/**
 * User routes
 */
export const userRoutes = container.resolve(UserRoutes);

