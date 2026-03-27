import http from "http";
import { Server } from "socket.io";
import { container } from "tsyringe";
import { config } from "../../shared/config";
import { TokenService } from "../service/token.service";
import type { CustomJwtPayload } from "../../presentation/middlewares/auth.middleware";
import { ChatHandler } from "../../presentation/realtime/chat/chat.handler";
import { NotificationsHandler } from "../../presentation/realtime/notifications/notifications.handler";
import { registerIoGetter } from "./getSocketIo";

let ioSingleton: Server | null = null;

export function initSocketServer(httpServer: http.Server): Server {
  if (ioSingleton) return ioSingleton;

  const io = new Server(httpServer, {
    cors: {
      origin: config.client.URI,
      credentials: true,
    },
  });

  const tokenService = new TokenService();

  io.use((socket, next) => {
    try {
      const auth = socket.handshake.auth;
      const authToken =
        typeof auth === "object" && auth !== null && "token" in auth
          ? (auth as { token?: unknown }).token
          : undefined;
      const tokenFromAuth = typeof authToken === "string" ? authToken : undefined;
      const headerAuth =
        typeof socket.handshake.headers.authorization === "string"
          ? socket.handshake.headers.authorization
          : undefined;
      const tokenFromHeader = headerAuth?.startsWith("Bearer ")
        ? headerAuth.split(" ")[1]
        : undefined;
      const token = tokenFromAuth || tokenFromHeader;

      if (!token) return next(new Error("Unauthorized"));

      const payload = tokenService.verifyAccessToken(token) as CustomJwtPayload | null;
      if (!payload?.id) return next(new Error("Unauthorized"));

      (socket.data as any).user = {
        id: payload.id,
        role: payload.role,
        email: payload.email,
      };

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  const chatHandler = container.resolve(ChatHandler);
  chatHandler.register(io);

  const notificationsHandler = container.resolve(NotificationsHandler);
  notificationsHandler.register(io);

  ioSingleton = io;
  registerIoGetter(() => ioSingleton);
  return ioSingleton;
}

