import { createLogger, format, transports } from "winston";
import logConfig from "../../config/logger/winstonConfig.js";

/**
 * Logger class that used to create logs for application
 */
export class LoggerHandler {
  logger;

  constructor() {
    this.logger = createLogger(logConfig.getConfig());
  }
  /**
   * Used to create logger
   * @param {*} app Express app to use that logger in middleware
   * @param {*} customConfig Custom config for logger if they need additionally
   * @returns Logger
   */
  CreateLogger({ app, customConfig = {} }) {
    if (Object.keys(customConfig)?.length > 0) {
      const config = logConfig.getConfig(customConfig);
      this.logger = createLogger(config);
    }
    app.use((req, res, next) => {
      this.logger.info(
        `${req.method} ${req.url} - ${req.ip}, ${
          req?.requestId ? "Request id: " + req.requestId : null
        }`
      );
      next();
    });
    return this.logger;
  }

  /**
   * Used to get the initialized logger
   * @returns logger
   */
  getLogger() {
    if (!this.logger) {
      throw new Error(
        "Logger not initialized, use CreateLogger() to initialize logger"
      );
    }
    return this.logger;
  }
  /**
   * Used to get the format
   * @returns format of logger
   */
  getLogFormat() {
    return format;
  }

  /**
   * Used to get the transport
   * @returns tranport of logger
   */
  getLogTransport() {
    return transports;
  }
}
