import mongoose from "mongoose";
import { config } from "../../../shared/config";

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
} as const;

export class MongoConnect {
  private _dburl: string;
  constructor() {
    this._dburl = config.database.URI;
  }
  async connectDB(): Promise<void> {
    try {
      await mongoose.connect(this._dburl, MONGO_OPTIONS);
      console.log("MongoDB connected");
      mongoose.connection.on("error", (error) => {
        console.error("mongoDb connection error", error);
      });
      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
}
