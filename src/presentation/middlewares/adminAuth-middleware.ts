import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, ERROR_MESSAGE } from "../../shared/constants/constants";
import { CustomRequest } from "./auth.middleware";

/**
 * Middleware: adminAuth
 * Verifies that the authenticated user has admin role
 * Must be used after verifyAuth middleware
 */
export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as CustomRequest).user;

    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.UNAUTHORIZED_ACCESS,
      });
      return;
    }

    if (user.role !== "admin") {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.FORBIDDEN,
      });
      return;
    }

    next();
  } catch (error: unknown) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};
