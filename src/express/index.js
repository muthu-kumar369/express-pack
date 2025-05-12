import express from "express";
import {
  CompressionHandler,
  LoggerHandler,
  RateLimitHandler,
} from "../../app.js";
import { BodyParser, Cors, DotEnv } from "../common/index.js";
import { SecurityHandler } from "../security/index.js";

export class ExpressPack {
  static #app = null;
  static #initialized = false;

  /**
   * Initializes the express app with provided middleware config
   * @param {*} config Middleware configuration object
   * @returns express app
   */
  static async init({ config = {} }) {
    if (this.#initialized) return this.#app;

    this.#app = express();

    // Add request ID middleware once
    this.#app.use((req, res, next) => {
      const requestId =
        req.headers["x-request-id"] ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader("X-Request-ID", requestId);
      next();
    });

    for (const [key, value] of Object.entries(config)) {
      this.#applyMiddleware({ key, value });
    }

    this.#initialized = true;
    return this.#app;
  }

  /**
   * Middleware dispatcher
   */
  static #applyMiddleware({ key, value }) {
    switch (key) {
      case "bodyParser":
        BodyParser.init({ app: this.#app, customConfig: value });
        break;

      case "cors":
        Cors.init({ app: this.#app, customConfig: value });
        break;

      case "env":
        DotEnv.init({ customPath: value });
        break;

      case "logger":
        LoggerHandler.init(value);
        this.#app.use(LoggerHandler.middleware());
        break;

      case "security":
        SecurityHandler.init({ app: this.#app, customConfig: value });
        break;

      case "compression":
        CompressionHandler.init({
          app: this.#app,
          customConfig: value,
        });
        break;

      case "express-rate-limit":
        RateLimitHandler.init({
          app: this.#app,
          customConfig: value,
        });
        break;

      default:
        console.warn(`[ExpressPack] Unknown middleware key: ${key}`);
    }
  }

  /**
   * Returns the initialized app instance
   */
  static getApp() {
    if (!this.#initialized) {
      throw new Error(
        "Express app not initialized. Call ExpressPack.init() first."
      );
    }
    return this.#app;
  }

  /**
   * Returns new Router instance
   */
  static getRouter() {
    return express.Router();
  }

  /**
   * Binds routes to app after init
   * @param {Array} routes Array of route config { path, route }
   */
  static initRoutes({ routes = [] }) {
    if (!this.#initialized) {
      throw new Error("Cannot bind routes before app initialization.");
    }

    for (const { path, route } of routes) {
      this.#app.use(path, route);
    }
  }

  /**
   * Check if app is initialized
   */
  static isInitialized() {
    return this.#initialized;
  }
}
