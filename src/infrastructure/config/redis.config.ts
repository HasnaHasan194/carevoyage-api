import { createClient } from "redis"

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 3000, 
    reconnectStrategy: false 
  }
});

redisClient.on("connect", () => {
  console.log(" Redis connected");
});

redisClient.on("error", (err) => {

});


export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      console.log("Attempting Redis connection...");
      await redisClient.connect();
      console.log("Redis connected successfully");
    } catch (error) {
      console.warn("Redis connection failed:", (error as Error).message);
      console.log("Server will continue without Redis caching...");
    
    }
  }
};
