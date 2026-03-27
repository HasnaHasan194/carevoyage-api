import { inject, injectable } from "tsyringe";
import type { Response } from "express";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import type { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import type { IChatService } from "../../../application/services/chat/chat.service";
import type { ChatAttachmentKind } from "../../../domain/entities/chat-message.entity";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants/constants";

@injectable()
export class ChatAttachmentController {
  constructor(
    @inject("IS3Service")
    private readonly _s3Service: IS3Service,
    @inject("IChatService")
    private readonly _chatService: IChatService
  ) {}

  async uploadAttachment(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user?.id) {
      ResponseHelper.error(res, ERROR_MESSAGE.GENERAL.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    if (!req.file) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.UPLOAD.NO_FILE_UPLOADED,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    const bookingId = req.body?.bookingId as string | undefined;
    if (!bookingId || typeof bookingId !== "string") {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.INVALID_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    // Enforce that only chat participants can upload
    await this._chatService.authorizeBookingParticipant(bookingId, req.user.id);

    const kind: ChatAttachmentKind = req.file.mimetype.startsWith("image/")
      ? "image"
      : "file";

    const folder = `chat/${bookingId}`;
    const s3Key = await this._s3Service.uploadPrivateFile(req.file, folder);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Attachment uploaded",
      {
        s3Key,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        kind,
      }
    );
  }
}

