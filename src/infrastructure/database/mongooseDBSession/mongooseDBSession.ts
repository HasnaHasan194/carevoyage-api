import mongoose, { ClientSession } from "mongoose";
import { injectable } from "tsyringe";

import { IDBSession } from "../../interface/session.interface";

@injectable()
export class MongooseDBSession implements IDBSession {
  private session: ClientSession | null = null;

  async start(): Promise<void> {
    this.session = await mongoose.startSession();
  }

  async end(): Promise<void> {
    if (this.session) {
      await this.session.endSession();
      this.session = null;
    }
  }

  getSession(): ClientSession {
    if (!this.session) {
      throw new Error("DB session not started");
    }
    return this.session;
  }

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.session) {
      this.session = await mongoose.startSession();
    }

    return this.session.withTransaction(fn);
  }
}
