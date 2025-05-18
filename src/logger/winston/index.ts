import { createLogger, Logger } from "winston";
import { Request, Response, NextFunction } from "express";
import logConfig from "../../config/logger/winstonConfig";

export class LoggerHandler {
  static #logger: Logger | null = null;
  static #initialized = false;

  /**
   * Configure the Winston logger (only once)
   */
  static init(customConfig: Record<string, unknown> = {}): void {
    if (this.#initialized) return;

    this.#logger = createLogger(logConfig.getConfig(customConfig));
    this.#initialized = true;
  }

  /**
   * Middleware for logging requests
   */
  static middleware() {
    if (!this.#logger) {
      throw new Error("Logger not initialized. Call init() first.");
    }

    return (
      req: Request & { requestId?: string },
      res: Response,
      next: NextFunction
    ): void => {
      this.#logger!.info(
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
  static getLogger(): Logger {
    if (!this.#logger) {
      throw new Error("Logger not initialized.");
    }
    return this.#logger;
  }

  /**
   * Check if logger is already initialized
   */
  static isInitialized(): boolean {
    return this.#initialized;
  }
}

// Eagerly initialize logger with default config (for quick use in app)
LoggerHandler.init();

// Export the singleton logger instance directly
export const logger = LoggerHandler.getLogger();
