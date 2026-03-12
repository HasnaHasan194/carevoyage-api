import "reflect-metadata";
import dotenv from "dotenv";
import http from "http";
import { App } from "./infrastructure/config/server/server";
import { config } from "./shared/config";
import { MongoConnect } from "./infrastructure/database/mongoDB/mongoConnect";
import { connectRedis } from "./infrastructure/config/redis.config";
import { ServiceRegistery } from "./infrastructure/dependencyinjection/service.register";
import { initSocketServer } from "./infrastructure/realtime/socketServer";

dotenv.config();

async function startServer() {
  try {
    ServiceRegistery.registerService();

    try {
      await connectRedis();
      console.log("Redis connected");
    } catch (redisError) {
      console.error("Redis connection failed, continuing without Redis:", redisError);
    }

    const mongo = new MongoConnect();
    await mongo.connectDB();
    console.log("MongoDB connected");

    const app = new App();
    const expressServer = app.getApp();

    const PORT = Number(config.server.PORT) || 3000;
    const httpServer = http.createServer(expressServer);

    initSocketServer(httpServer);

    httpServer.on("error", (err: NodeJS.ErrnoException) => {
      console.error("HTTP server error:", err);
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
