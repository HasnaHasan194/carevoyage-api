import { injectable } from "tsyringe";
import type { INotificationRealtimePublisher } from "../../application/interfaces/realtime/notification-realtime.publisher.interface";
import type { NotificationPushDTO } from "../../application/services/notification/notification.types";
import { getSocketIo } from "./getSocketIo";

@injectable()
export class SocketIONotificationRealtimePublisher
  implements INotificationRealtimePublisher
{
  publishToUser(userId: string, payload: NotificationPushDTO): void {
    const io = getSocketIo();
    io.to(`user:${userId}`).emit("notification:new", payload);
  }

  publishToRole(role: string, payload: NotificationPushDTO): void {
    const io = getSocketIo();
    io.to(`role:${role}`).emit("notification:new", payload);
  }
}

