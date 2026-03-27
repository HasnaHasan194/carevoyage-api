import type { Server, Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import type { IChatService } from "../../../application/services/chat/chat.service";
import type { ChatAttachmentInput } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import type { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { NotificationService } from "../../../application/services/notification/notification.service";

type AuthedSocket = Socket & {
  data: Socket["data"] & {
    user?: { id: string; role: string; email?: string };
  };
};

@injectable()
export class ChatHandler {
  constructor(
    @inject("IChatService")
    private readonly _chatService: IChatService,
    @inject("IS3Service")
    private readonly _s3Service: IS3Service,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  register(io: Server): void {
    io.on("connection", (socket: AuthedSocket) => {
      socket.on("chat:join", async (payload: { bookingId: string }) => {
        const userId = socket.data.user?.id;
        if (!userId) return;
        await this._chatService.authorizeBookingParticipant(
          payload.bookingId,
          userId
        );
        socket.join(`booking:${payload.bookingId}`);
      });

      socket.on(
        "chat:send",
        async (
          payload: {
            bookingId: string;
            text?: string;
            attachments?: ChatAttachmentInput[] | null;
            clientMessageId?: string;
          },
          ack?: (resp: { ok: boolean; error?: string; message?: unknown }) => void
        ) => {
          try {
            const userId = socket.data.user?.id;
            if (!userId) throw new Error("Unauthorized");
            const msg = await this._chatService.sendMessage({
              bookingId: payload.bookingId,
              userId,
              text: payload.text,
              attachments: payload.attachments,
              clientMessageId: payload.clientMessageId,
            });

            if (msg.attachments?.length) {
              const s3Keys = msg.attachments.map((a) => a.s3Key);
              const signedUrls = await this._s3Service.getSignedUrls(s3Keys);
              msg.attachments = msg.attachments.map((a, idx) => ({
                kind: a.kind,
                s3Key: a.s3Key,
                originalName: a.originalName,
                mimeType: a.mimeType,
                sizeBytes: a.sizeBytes,
                url: signedUrls[idx],
              }));
            }
            io.to(`booking:${payload.bookingId}`).emit("chat:message", msg);

            const booking = await this._bookingRepository.findById(payload.bookingId);
            if (booking) {
              let recipientUserId: string | null = null;
              let recipientRole: "client" | "caretaker" | null = null;

              if (msg.senderRole === "caretaker") {
                recipientUserId = booking.clientId;
                recipientRole = "client";
              } else if (booking.caretakerId) {
                const caretakerProfile = await this._caretakerProfileRepository.findById(
                  booking.caretakerId
                );
                if (caretakerProfile?.userId) {
                  recipientUserId = caretakerProfile.userId;
                  recipientRole = "caretaker";
                }
              }

              if (recipientUserId && recipientUserId !== msg.senderUserId && recipientRole) {
                await this._notificationService.createAndPublish({
                  recipientUserId,
                  recipientRole,
                  type: "NEW_CHAT_MESSAGE",
                  title: "New message",
                  message:
                    msg.senderRole === "caretaker"
                      ? "You received a message from your caretaker."
                      : "You received a message from your client.",
                  link:
                    recipientRole === "client"
                      ? "/client/messages"
                      : "/caretaker/messages",
                  metadata: {
                    type: "NEW_CHAT_MESSAGE",
                    bookingId: payload.bookingId,
                    senderUserId: msg.senderUserId,
                    senderRole: msg.senderRole,
                  },
                });
              }
            }
            ack?.({ ok: true, message: msg });
          } catch (e) {
            ack?.({ ok: false, error: (e as Error).message || "Error" });
          }
        }
      );
    });
  }
}

