import { CompressionHandler, RateLimitHandler } from "../../app.js";
import { BodyParser, Cors, DotEnv } from "../common/index.js";
import LoggerHandler from "../logger/winston/index.js";
import { SecurityHandler } from "../security/index.js";

import express from "express";

class ExpressPack {
  static instance = null;
  static app = null;

  constructor() {
    if (ExpressPack.instance) {
      return ExpressPack.instance;
    }

    ExpressPack.app = express();
    ExpressPack.instance = this;
  }

  /**
   * Creates or returns the existing app instance with middleware setup
   * @param {*} config Configuration object for middlewares
   * @returns express app
   */
  static createApp({ config = {} } = {}) {
    if (!ExpressPack.instance) {
      new ExpressPack();
    }

    // Add request ID tracing middleware once
    ExpressPack.app.use((req, res, next) => {
      const requestId =
        req.headers["x-request-id"] ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader("X-Request-ID", requestId);
      next();
    });

    // Apply configured middlewares
    if (Object.keys(config)?.length) {
      Object.entries(config).forEach(([key, value]) => {
        ExpressPack.applyMiddleware({ key, value });
      });
    }

    return ExpressPack.app;
  }

  /**
   * Applies a middleware to the app
   * @param {*} key Middleware key
   * @param {*} value Middleware config
   */
  static applyMiddleware({ key, value }) {
    switch (key) {
      case "bodyParser":
        BodyParser.setupBodyParser({
          app: ExpressPack.app,
          customConfig: value,
        });
        break;

      case "cors":
        Cors.setupCors({ app: ExpressPack.app, customConfig: value });
        break;

      case "env":
        DotEnv.loadEnv({ customPath: value });
        break;

      case "logger":
        LoggerHandler.configureLogger(value); // optional custom setup
        ExpressPack.app.use(LoggerHandler.middleware()); // attach logger
        break;

      case "security":
        SecurityHandler.setupSecurity({
          app: ExpressPack.app,
          customConfig: value,
        });
        break;

      case "compression":
        CompressionHandler.setupCompress({
          app: ExpressPack.app,
          customConfig: value,
        });
        break;

      case "express-rate-limit":
        RateLimitHandler.setupRateLimit({
          app: ExpressPack.app,
          customConfig: value,
        });
        break;
    }
  }

  /**
   * Get new express router
   */
  static getRoute() {
    return express.Router();
  }

  /**
   * Bind multiple routes to the app
   * @param {Array} routes Array of route config: { path, route }
   */
  static bindRoutes({ routes }) {
    if (!ExpressPack.app) {
      throw new Error("App not initialized. Call createApp() first.");
    }

    routes?.forEach((option) => {
      ExpressPack.app.use(option.path, option.route);
    });
  }
}

export default ExpressPack;
