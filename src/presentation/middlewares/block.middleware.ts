import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../../domain/repositoryInterfaces/User/user.repository.interface";
import { IBlockedUserMiddleware } from "../interfaces/controllers/user/blocked-user.middleware.interface";

import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../shared/constants/constants";

import { clearCookie } from "../../shared/utils/cookieHelper";
import { CustomRequest } from "./auth.middleware";

@injectable()
export class BlockedUserMiddleware implements IBlockedUserMiddleware {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async checkBlockedUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.AUTHENTICATION.UNAUTHORIZED_ACCESS,
        });
        return;
      }

      const { id, role } = req.user;

      // Admin should never be blocked
      if (role === "admin") {
        next();
        return;
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.AUTHENTICATION.USER_NOT_FOUND
        });
        return;
      }

      if (user.isBlocked) {
        clearCookie(
          res,
          COOKIES_NAMES.ACCESS_TOKEN,
          COOKIES_NAMES.REFRESH_TOKEN
        );

        res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGE.AUTHENTICATION.USER_BLOCKED
        });
        return;
      }

      next();
    } catch (error) {
      console.error("BlockedUserMiddleware error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.SERVER_ERROR
      });
    }
  }
}
