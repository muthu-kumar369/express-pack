import {
  BodyParser,
  CompressionHandler,
  Cors,
  DotEnv,
} from "../common/index.js";
import { LoggerHandler } from "../logger/index.js";
import { RateLimitHandler, SecurityHandler } from "../security/index.js";

import express from "express";

/**
 * Class that have method which is provided from Express pack
 */
export class ExpressPack {
  app;

  constructor() {
    this.express = express;
    this.app = express();
  }

  /**
   * Used to create the app
   * @returns express app
   */
  createApp({ config = {} }) {
    // apply trace by create and attach request id
    this.app.use((req, res, next) => {
      const requestId =
        req.headers["x-request-id"] ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId; // Attach the request ID to the request object
      res.setHeader("X-Request-ID", requestId); // Return the ID in the response headers
      next();
    });

    // apply middleware based on given config
    if (Object.keys(config)?.length) {
      Object.entries(config).map(([key, value]) => {
        this.applyMiddleware({ key, value });
      });
    }

    return this.app;
  }
  /**
   * Used to attach middleware with app
   * @param {*} key the setup key the need to apply
   * @param {*} value configuration of the setup
   */
  applyMiddleware({ key, value }) {
    const loggerHander = new LoggerHandler();
    switch (key) {
      case "bodyParser":
        BodyParser.setupBodyParser({ app: this.app, customConfig: value });
        break;

      case "cors":
        Cors.setupCors({ app: this.app, customConfig: value });
        break;

      case "env":
        DotEnv.loadEnv({ customPath: value });
        break;

      case "logger":
        loggerHander.CreateLogger({ app: this.app, customConfig: value });
        break;

      case "security":
        SecurityHandler.setupSecurity({ app: this.app, customConfig: value });
        break;

      case "compression":
        CompressionHandler.setupCompress({
          app: this.app,
          customConfig: value,
        });
        break;

      case "express-rate-limit":
        RateLimitHandler.setupRateLimit({ app: this.app, customConfig: value });
        break;
    }
  }
  /**
   * Create the express routes
   * @returns express router
   */
  getRoute() {
    return express.Router();
  }

  /**
   * Used to bind the routes with app
   * @param {Array} routes Collection of routes
   */
  bindRoutes({ routes }) {
    if (!this.app) {
      throw new Error(
        "app not initialized, Initialize app by using CreateApp()"
      );
    }
    if (routes?.length) {
      routes?.map((option) => {
        this.app.use(option?.path, option?.route);
      });
    }
  }
}
