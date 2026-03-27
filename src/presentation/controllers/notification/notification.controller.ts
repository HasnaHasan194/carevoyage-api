import { inject, injectable } from "tsyringe";
import type { Response } from "express";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants/constants";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import type { IListMyNotificationsUseCase } from "../../../application/usecase/interfaces/notification/list-notifications.interface";
import type { IMarkNotificationReadUseCase } from "../../../application/usecase/interfaces/notification/mark-notification-read.interface";
import type { IMarkAllNotificationsReadUseCase } from "../../../application/usecase/interfaces/notification/mark-all-notifications-read.interface";

@injectable()
export class NotificationController {
  constructor(
    @inject("IListMyNotificationsUseCase")
    private readonly _listMyNotificationsUseCase: IListMyNotificationsUseCase,
    @inject("IMarkNotificationReadUseCase")
    private readonly _markReadUseCase: IMarkNotificationReadUseCase,
    @inject("IMarkAllNotificationsReadUseCase")
    private readonly _markAllReadUseCase: IMarkAllNotificationsReadUseCase
  ) {}

  async listMyNotifications(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const unreadOnly = String(req.query.unreadOnly || "") === "true";

    const result = await this._listMyNotificationsUseCase.execute({
      userId: req.user.id,
      page,
      limit,
      unreadOnly,
    });

    ResponseHelper.success(res, HTTP_STATUS.OK, "Notifications fetched", result);
  }

  async markRead(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const notificationId = String(req.params.id || "").trim();
    if (!notificationId) {
      ResponseHelper.error(res, ERROR_MESSAGE.GENERAL.INVALID_REQUEST, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const ok = await this._markReadUseCase.execute({
      userId: req.user.id,
      notificationId,
    });

    ResponseHelper.success(res, HTTP_STATUS.OK, "Notification updated", { ok });
  }

  async markAllRead(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const updated = await this._markAllReadUseCase.execute({ userId: req.user.id });
    ResponseHelper.success(res, HTTP_STATUS.OK, "Notifications updated", { updated });
  }
}

