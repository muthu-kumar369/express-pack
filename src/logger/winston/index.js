// logger/winston/index.js
import { createLogger, format, transports } from "winston";
import logConfig from "../../config/logger/winstonConfig.js";

class LoggerHandler {
  static logger = null;

  constructor(config = {}) {
    if (!LoggerHandler.logger) {
      LoggerHandler.logger = createLogger(logConfig.getConfig(config));
    }
  }

  static configureLogger(customConfig = {}) {
    if (LoggerHandler.logger) return; // prevent re-initialization
    LoggerHandler.logger = createLogger(logConfig.getConfig(customConfig));
  }

  static middleware() {
    if (!LoggerHandler.logger) {
      throw new Error(
        "Logger not initialized. Use configureLogger() before using middleware."
      );
    }

    return (req, res, next) => {
      LoggerHandler.logger.info(
        `${req.method} ${req.url} - ${req.ip}${
          req?.requestId ? ` | Request id: ${req.requestId}` : ""
        }`
      );
      next();
    };
  }

  static getLogger() {
    if (!LoggerHandler.logger) {
      throw new Error("Logger not initialized.");
    }
    return LoggerHandler.logger;
  }
}

// Immediately create default logger (with default config)
new LoggerHandler();

export const logger = LoggerHandler.getLogger();
export default LoggerHandler;
