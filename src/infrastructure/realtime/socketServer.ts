import http from "http";
import { Server } from "socket.io";
import { container } from "tsyringe";
import { config } from "../../shared/config";
import { TokenService } from "../service/token.service";
import type { CustomJwtPayload } from "../../presentation/middlewares/auth.middleware";
import { ChatHandler } from "../../presentation/realtime/chat/chat.handler";

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
      const authToken = (socket.handshake.auth as any)?.token as string | undefined;
      const headerAuth = socket.handshake.headers.authorization as string | undefined;
      const tokenFromHeader = headerAuth?.startsWith("Bearer ")
        ? headerAuth.split(" ")[1]
        : undefined;
      const token = authToken || tokenFromHeader;

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

  ioSingleton = io;
  return ioSingleton;
}

