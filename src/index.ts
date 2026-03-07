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
      console.warn(
        "[startup] Redis connection failed, continuing without Redis:",
        (redisError as Error).message,
      );
    }

    const mongo = new MongoConnect();
    await mongo.connectDB();
    console.log("MongoDB connected");

    const app = new App();
    const expressServer = app.getApp();

    const PORT = Number(config.server.PORT) || 3000;
    expressServer.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
      
      try { require('fs').appendFileSync(require('path').join(process.cwd(),'debug.log'), JSON.stringify({location:'index.ts:startup',message:'SERVER STARTED - canary log',data:{port:PORT,cwd:process.cwd()},timestamp:Date.now(),hypothesisId:'CANARY'})+'\n'); } catch(e){ console.error('CANARY LOG FAILED:', e); }
     
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
