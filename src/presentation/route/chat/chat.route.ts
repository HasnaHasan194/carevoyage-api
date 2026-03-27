import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { blockedUserMiddleware } from "../../../infrastructure/dependencyinjection/resolve";
import { ROUTES } from "../routes.constants";
import { chatAttachmentController, chatController } from "../../../infrastructure/dependencyinjection/resolve";
import multer from "multer";

@injectable()
export class ChatRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    });

    this.router.get(
      ROUTES.CHAT.CONVERSATIONS,
      asyncHandler(chatController.listConversations.bind(chatController))
    );

    this.router.get(
      ROUTES.CHAT.BOOKING_MESSAGES,
      asyncHandler(chatController.getBookingMessages.bind(chatController))
    );

    this.router.post(
      ROUTES.CHAT.ATTACHMENTS_UPLOAD,
      upload.single("file"),
      asyncHandler(chatAttachmentController.uploadAttachment.bind(chatAttachmentController))
    );
  }
}

