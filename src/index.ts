import "reflect-metadata";
import dotenv from "dotenv";
import { App } from "./infrastructure/config/server/server";
import { config } from "./shared/config";
import { MongoConnect } from "./infrastructure/database/mongoDB/mongoConnect";
import { connectRedis } from "./infrastructure/config/redis.config";
import { ServiceRegistery } from "./infrastructure/dependencyinjection/service.register";

dotenv.config();

async function startServer() {
  try {
    ServiceRegistery.registerService();
    
    
    try {
      await connectRedis();
      console.log("Redis connected");
    } catch (redisError) {
      console.warn("Redis connection failed, continuing without Redis:", (redisError as Error).message);
    }

    const mongo = new MongoConnect();
    await mongo.connectDB();
    console.log("MongoDB connected");

    const app = new App();
    const expressServer = app.getApp();

    const PORT = Number(config.server.PORT) || 3000;

    expressServer.listen(PORT, () =>
      console.log(`Server running at port ${PORT}`)
    );
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}


startServer();

