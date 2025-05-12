// logger/winston/index.js

import { createLogger } from "winston";
import logConfig from "../../config/logger/winstonConfig.js";

export class LoggerHandler {
  static #logger = null;
  static #initialized = false;

  /**
   * Configure the Winston logger (only once)
   */
  static init(customConfig = {}) {
    if (this.#initialized) return;

    this.#logger = createLogger(logConfig.getConfig(customConfig));
    this.#initialized = true;
  }

  /**
   * Middleware for logging requests
   */
  static middleware() {
    if (!this.#logger) {
      throw new Error("Logger not initialized. Call configureLogger() first.");
    }

    return (req, res, next) => {
      this.#logger.info(
        `${req.method} ${req.url} - ${req.ip}${
          req.requestId ? ` | Request ID: ${req.requestId}` : ""
        }`
      );
      next();
    };
  }

  /**
   * Get logger instance
   */
  static getLogger() {
    if (!this.#logger) {
      throw new Error("Logger not initialized.");
    }
    return this.#logger;
  }

  /**
   * Check if logger is already initialized
   */
  static isInitialized() {
    return this.#initialized;
  }
}

// Eagerly initialize logger with default config (for quick use in app)
LoggerHandler.init();

// Export the singleton logger instance directly
export const logger = LoggerHandler.getLogger();
