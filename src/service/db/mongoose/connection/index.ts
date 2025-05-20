import mongoose, {
  ConnectOptions,
  Mongoose as MongooseInstance,
} from "mongoose";
import { MongooseConfig } from "../../types/mongoose/connection.types";

export class Mongoose {
  static #instance: Mongoose | null = null;
  static #isConnected = false;
  static #uri = "";
  static #options: ConnectOptions = {};

  private constructor() {
    if (Mongoose.#instance) return Mongoose.#instance;
    Mongoose.#instance = this;

    mongoose.connection.on("connected", () => {
      Mongoose.#isConnected = true;
      console.log("[MongoDB] Connected");
    });

    mongoose.connection.on("disconnected", () => {
      Mongoose.#isConnected = false;
      console.log("[MongoDB] Disconnected. Retrying in 5s...");
      setTimeout(() => Mongoose.#reconnect(), 5000);
    });

    mongoose.connection.on("error", (err: Error) => {
      console.error("[MongoDB] Connection error:", err);
    });
  }

  static async init({ uri, options = {} }: MongooseConfig): Promise<void> {
    if (!uri) {
      throw new Error("[MongoDB] URI is required to connect");
    }

    Mongoose.#uri = uri;
    Mongoose.#options = options;

    if (!Mongoose.#instance) {
      new Mongoose();
    }

    if (!Mongoose.#isConnected) {
      await Mongoose.#connect();
    }
  }

  static async #connect(): Promise<void> {
    try {
      await mongoose.connect(Mongoose.#uri, Mongoose.#options);
    } catch (err) {
      console.error("[MongoDB] Initial connect failed. Retrying...");
      setTimeout(() => Mongoose.#reconnect(), 5000);
    }
  }

  static async #reconnect(): Promise<void> {
    if (!Mongoose.#isConnected && Mongoose.#uri) {
      try {
        await mongoose.connect(Mongoose.#uri, Mongoose.#options);
      } catch (err) {
        console.error("[MongoDB] Reconnect failed. Retrying...");
        setTimeout(() => Mongoose.#reconnect(), 5000);
      }
    }
  }

  static getMongoose(): typeof mongoose {
    return mongoose;
  }
}
