import type { Server, Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import type { IChatService } from "../../../application/services/chat/chat.service";

type AuthedSocket = Socket & {
  data: Socket["data"] & {
    user?: { id: string; role: string; email?: string };
  };
};

@injectable()
export class ChatHandler {
  constructor(
    @inject("IChatService")
    private readonly _chatService: IChatService
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
          payload: { bookingId: string; text: string; clientMessageId?: string },
          ack?: (resp: { ok: boolean; error?: string; message?: unknown }) => void
        ) => {
          try {
            const userId = socket.data.user?.id;
            if (!userId) throw new Error("Unauthorized");
            const msg = await this._chatService.sendMessage({
              bookingId: payload.bookingId,
              userId,
              text: payload.text,
              clientMessageId: payload.clientMessageId,
            });
            io.to(`booking:${payload.bookingId}`).emit("chat:message", msg);
            ack?.({ ok: true, message: msg });
          } catch (e) {
            ack?.({ ok: false, error: (e as Error).message || "Error" });
          }
        }
      );
    });
  }
}

