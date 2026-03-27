import type { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";

type AuthedSocket = Socket & {
  data: Socket["data"] & {
    user?: { id: string; role: string; email?: string };
  };
};

@injectable()
export class NotificationsHandler {
  register(io: Server): void {
    io.on("connection", (socket: AuthedSocket) => {
      const userId = socket.data.user?.id;
      const role = socket.data.user?.role;
      if (!userId) return;

      socket.join(`user:${userId}`);
      if (role) socket.join(`role:${role}`);
    });
  }
}

