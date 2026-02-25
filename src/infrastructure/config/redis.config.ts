import { createClient } from "redis"

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 3000, 
    reconnectStrategy: false 
  }
});

redisClient.on("connect", () => {});

redisClient.on("error", (err) => {

});


export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.warn("Redis connection failed:", (error as Error).message);
    }
  }
};
