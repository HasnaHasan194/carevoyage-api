import { inject, injectable } from "tsyringe";
import type { Response } from "express";
import type { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS, ERROR_MESSAGE } from "../../../shared/constants/constants";
import type { IChatRepository } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IListChatConversationsUseCase } from "../../../application/usecase/interfaces/chat/list-chat-conversations.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import type { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";

@injectable()
export class ChatController {
  constructor(
    @inject("IChatRepository")
    private readonly _chatRepository: IChatRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IS3Service")
    private readonly _s3Service: IS3Service,
    @inject("IListChatConversationsUseCase")
    private readonly _listChatConversationsUseCase: IListChatConversationsUseCase
  ) {}

  async listConversations(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const role = req.user.role;
    if (role !== "client" && role !== "caretaker") {
      ResponseHelper.error(res, ERROR_MESSAGE.GENERAL.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
      return;
    }

    const limitRaw = req.query.limit as string | undefined;
    const limit = limitRaw ? Number(limitRaw) : undefined;

    const conversations = await this._listChatConversationsUseCase.execute(
      req.user.id,
      role,
      limit
    );

    ResponseHelper.success(res, HTTP_STATUS.OK, "Conversations retrieved", conversations);
  }

  async getBookingMessages(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const bookingId = (req.params as { bookingId?: string }).bookingId;
    if (!bookingId) {
      ResponseHelper.error(res, ERROR_MESSAGE.BOOKING.NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      ResponseHelper.error(res, ERROR_MESSAGE.BOOKING.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      return;
    }

    const isClient = booking.clientId === req.user.id;
    let isCaretaker = false;
    if (booking.caretakerId) {
      const profile = await this._caretakerProfileRepository.findById(booking.caretakerId);
      isCaretaker = profile?.userId === req.user.id;
    }

    if (!isClient && !isCaretaker) {
      ResponseHelper.error(res, ERROR_MESSAGE.GENERAL.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
      return;
    }

    const cursor = req.query.cursor as string | undefined;
    const limitRaw = req.query.limit as string | undefined;
    const limit = limitRaw ? Number(limitRaw) : undefined;

    const messages = await this._chatRepository.getMessages({
      bookingId,
      cursor,
      limit,
    });

    const enrichedMessages = await Promise.all(
      messages.map(async (m) => {
        const attachments = m.attachments ?? [];
        if (!attachments.length) return m;

        const s3Keys = attachments.map((a) => a.s3Key);
        const signedUrls = await this._s3Service.getSignedUrls(s3Keys);

        return {
          ...m,
          attachments: attachments.map((a, idx) => ({
            kind: a.kind,
            s3Key: a.s3Key,
            originalName: a.originalName,
            mimeType: a.mimeType,
            sizeBytes: a.sizeBytes,
            url: signedUrls[idx],
          })),
        };
      })
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Messages retrieved",
      enrichedMessages
    );
  }
}

