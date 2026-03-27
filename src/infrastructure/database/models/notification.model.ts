import mongoose from "mongoose";
import {
  notificationSchema,
  type INotificationModel,
} from "../schemas/notification.schema";

export const notificationDB = mongoose.model<INotificationModel>(
  "notification",
  notificationSchema
);

