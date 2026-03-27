import type { Server } from "socket.io";

let getIoSingleton: (() => Server | null) | null = null;

export function registerIoGetter(getter: () => Server | null): void {
  getIoSingleton = getter;
}

export function getSocketIo(): Server {
  const io = getIoSingleton?.() ?? null;
  if (!io) {
    throw new Error("Socket.IO server not initialized");
  }
  return io;
}

