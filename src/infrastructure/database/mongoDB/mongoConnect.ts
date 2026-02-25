import mongoose from "mongoose";
import { config } from "../../../shared/config";
export class MongoConnect {
  private _dburl: string;
  constructor() {
    this._dburl = config.database.URI;
  }
  async connectDB() {
    try {
      await mongoose.connect(this._dburl);
      console.log("db connected successsfully");
      mongoose.connection.on("error", (error) => {
        console.error("mongoDb connection error", error);
      });
      mongoose.connection.on("disconnected", () => {
        console.warn("mongoDb disconnected");
      });
    } catch (error) {
      console.error("failed to connect mongoDB", error);
    }
  }
}
