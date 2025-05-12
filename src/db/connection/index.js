// src/db/Mongoose.js
import mongoose from "mongoose";

export class Mongoose {
  static #instance;
  static #isConnected = false;
  static #uri = "";
  static #options = {};

  constructor() {
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

    mongoose.connection.on("error", (err) => {
      console.error("[MongoDB] Connection error:", err);
    });
  }

  static async init(uri, options = {}) {
    if (!uri) {
      throw new Error("[MongoDB] URI is required to connect");
      return;
    }

    Mongoose.#uri = uri;
    Mongoose.#options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    };

    if (!Mongoose.#instance) {
      new Mongoose();
    }

    if (!Mongoose.#isConnected) {
      await Mongoose.#connect();
    }
  }

  static async #connect() {
    try {
      await mongoose.connect(Mongoose.#uri, Mongoose.#options);
    } catch (err) {
      console.error("[MongoDB] Initial connect failed. Retrying...");
      setTimeout(() => Mongoose.#reconnect(), 5000);
    }
  }

  static async #reconnect() {
    if (!Mongoose.#isConnected && Mongoose.#uri) {
      try {
        await mongoose.connect(Mongoose.#uri, Mongoose.#options);
      } catch (err) {
        console.error("[MongoDB] Reconnect failed. Retrying...");
        setTimeout(() => Mongoose.#reconnect(), 5000);
      }
    }
  }

  static getMongoose() {
    return mongoose;
  }
}
