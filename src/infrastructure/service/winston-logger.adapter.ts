import { injectable } from "tsyringe";
import { ILogger,LogMeta } from "../../domain/service-interfaces/logger.interface";
import { logger } from "../config/logger/winston.logger.config";


@injectable()
export class WinstonLoggerAdapter implements ILogger {
  info(message: string, meta?: LogMeta): void {
    logger.info(message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    logger.error(message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    logger.warn(message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    logger.debug(message, meta);
  }
}
