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
      await Promise.race([
        connectRedis(),
        new Promise<void>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "Redis connect timed out after 5s (is Redis running?)",
                ),
              ),
            5000,
          ),
        ),
      ]);
      console.log("Redis connected");
    } catch {
      // Continue without Redis when unavailable or timed out
    }

    const mongo = new MongoConnect();
    await mongo.connectDB();

    const app = new App();
    const expressApp = app.getApp();
    const httpServer = http.createServer(expressApp);
    initSocketServer(httpServer);

    const PORT = config.server.PORT;
    await new Promise<void>((resolve, reject) => {
      const onError = (err: NodeJS.ErrnoException) => reject(err);
      httpServer.once("error", onError);
      httpServer.once("listening", () => {
        httpServer.removeListener("error", onError);
        console.log(`Server running on port ${PORT}`);
        resolve();
      });
      httpServer.listen(PORT);
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
