import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../../infrastructure/service/token.service";
import { redisClient } from "../../infrastructure/config/redis.config";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../shared/constants/constants";

const tokenService = new TokenService();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedUser extends CustomJwtPayload {
  accessToken: string;
  refreshToken: string;
}

export interface CustomRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * Helper: check if a token is blacklisted in Redis
 */
const isBlackListed = async (token: string): Promise<boolean> => {
  try {
    const result = await redisClient.get(token);
    return result !== null;
  } catch (error) {
    // If Redis fails, assume token is not blacklisted to avoid blocking valid requests
    return false;
  }
};

/**
 * Middleware: verifyAuth
 * Verifies access token from cookies and sets req.user
 */
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies[COOKIES_NAMES.REFRESH_TOKEN];
    const token = req.cookies[COOKIES_NAMES.ACCESS_TOKEN];

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.UNAUTHORIZED_ACCESS,
      });
      return;
    }

    const user = tokenService.verifyAccessToken(token) as CustomJwtPayload | null;

    if (!user || !user.id) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.UNAUTHORIZED_ACCESS,
      });
      return;
    }

    if (await isBlackListed(token)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.TOKEN_BLACK_LISTED,
      });
      return;
    }

    if (refreshToken && (await isBlackListed(refreshToken))) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.TOKEN_BLACK_LISTED,
      });
      return;
    }

    (req as CustomRequest).user = {
      ...user,
      accessToken: token,
      refreshToken: refreshToken || "",
    };

    next();
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")
    ) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.TOKEN_EXPIRED_ACCESS,
      });
      return;
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGE.AUTHENTICATION.INVALID_TOKEN,
    });
  }
};

/**
 * Middleware: decodeToken
 * Decodes token without verification (for optional auth)
 */
export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies[COOKIES_NAMES.ACCESS_TOKEN];

    if (!token) {
      next();
      return;
    }

    if (await isBlackListed(token)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.TOKEN_BLACK_LISTED,
      });
      return;
    }

    const user = tokenService.decodeAcessToken(token) as CustomJwtPayload | null;

    if (user && user.id) {
      (req as CustomRequest).user = {
        id: user.id,
        email: user.email || "",
        role: user.role || "",
        accessToken: token,
        refreshToken: req.cookies[COOKIES_NAMES.REFRESH_TOKEN] || "",
      };
    }

    next();
  } catch (error: unknown) {
    // If decode fails, continue without user (optional auth)
    next();
  }
};

/**
 * Middleware factory: authorizeRole
 * Checks if user has one of the allowed roles
 */
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as CustomRequest).user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: ERROR_MESSAGE.AUTHENTICATION.FORBIDDEN,
        userRole: user ? user.role : "None",
      });
      return;
    }

    next();
  };
};

