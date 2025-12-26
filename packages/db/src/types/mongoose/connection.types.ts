import type { ConnectOptions } from "mongoose";

export interface MongooseConfig {
  uri: string;
  options?: ConnectOptions;
}
