import { Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../../domain/repositoryInterfaces/User/user.repository.interface";
import { IAgencyRepository } from "../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
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
    private readonly userRepository: IUserRepository,
    @inject("IAgencyRepository")
    private readonly agencyRepository: IAgencyRepository
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
      return next();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGE.USER.NOT_FOUND,
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
        message: ERROR_MESSAGE.AUTHENTICATION.USER_BLOCKED,
        forceLogout: true,
      });
      return;
    }

    if (role === "agency_owner") {
      const agency = await this.agencyRepository.findByUserId(id);
      if (agency) {
        if (agency.isBlocked) {
          clearCookie(
            res,
            COOKIES_NAMES.ACCESS_TOKEN,
            COOKIES_NAMES.REFRESH_TOKEN
          );
          res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGE.AGENCY.ACCOUNT_BLOCKED,
            forceLogout: true,
          });
          return;
        }
        if (agency.verificationStatus === "rejected") {
          clearCookie(
            res,
            COOKIES_NAMES.ACCESS_TOKEN,
            COOKIES_NAMES.REFRESH_TOKEN
          );
          res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGE.AGENCY.REGISTRATION_REJECTED,
            forceLogout: true,
          });
          return;
        }
        if (agency.verificationStatus !== "verified") {
          clearCookie(
            res,
            COOKIES_NAMES.ACCESS_TOKEN,
            COOKIES_NAMES.REFRESH_TOKEN
          );
          res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGE.AGENCY.REGISTRATION_PENDING,
            forceLogout: true,
          });
          return;
        }
      }
    }

    next();
  } catch (error) {
    console.error("BlockedUserMiddleware error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGE.AUTHENTICATION.SERVER_ERROR,
    });
  }
}
}
