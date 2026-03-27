import { NextFunction, Response, Request } from "express";
import { CustomError } from "../../domain/errors/customError";
import { NotFoundError } from "../../domain/errors/notFoundError";
import { ValidationError } from "../../domain/errors/validationError";
import { HTTP_STATUS,ERROR_MESSAGE } from "../../shared/constants/constants";
import { IErrorMiddleware } from "../interfaces/controllers/auth/error-middleware.interface";
export class ErrorMiddleware implements IErrorMiddleware {
  public handleError(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ): void {
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGE.AUTHENTICATION.SERVER_ERROR;

    const anyErr = err as unknown as {
      name?: string;
      code?: number;
      keyPattern?: Record<string, unknown>;
      message?: string;
    };

    if (err instanceof CustomError) {
      statusCode = err.statusCode;
      message = err.message;
      if (err instanceof ValidationError) {
        message = err.message;
      }
    } else if (err instanceof NotFoundError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (anyErr?.name === "MongoServerError" && anyErr?.code === 11000) {
      // Duplicate key errors (e.g., unique bookingId in refund requests)
      statusCode = HTTP_STATUS.CONFLICT;
      message =
        anyErr?.keyPattern && "bookingId" in anyErr.keyPattern
          ? ERROR_MESSAGE.REFUND.ALREADY_REQUESTED
          : ERROR_MESSAGE.GENERAL.INVALID_REQUEST;
    } else if (anyErr?.name === "CastError") {
      // Invalid ObjectId in params/body (Mongoose cast error)
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = ERROR_MESSAGE.GENERAL.INVALID_REQUEST;
    }

    console.error(
      `statusCode ${statusCode}`,
      `message ${message}, error : ${err}`
    );

    res.status(statusCode).json({ success: false, message });
  }
}