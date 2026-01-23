import { ClientSession } from "mongoose";

export interface IDBSession<SessionType = ClientSession>{
  start(): Promise<void>;
  end(): Promise<void>;
  getSession(): SessionType;
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
