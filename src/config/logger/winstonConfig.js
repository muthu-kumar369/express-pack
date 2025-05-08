import { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const config = {
  logConfig: {
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add a timestamp
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [
      new transports.Console(), // Console logs
      new DailyRotateFile({
        filename: path.join("logs", "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: `14d`,
        level: "info",
      }),
      new DailyRotateFile({
        filename: path.join("logs", "errors-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: `30d`,
        level: "error",
      }),
    ],
    exitOnError: false,
  },
  getConfig: (config = {}) => {
    return {
      level: config?.level || "info",
      format:
        config?.format ||
        format.combine(
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add a timestamp
          format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
          })
        ),
      transports: config?.transports || [
        new transports.Console(), // Console logs
        new DailyRotateFile({
          filename: path.join("logs", "app-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: `14d`,
          level: "info",
        }),
        new DailyRotateFile({
          filename: path.join("logs", "errors-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: `30d`,
          level: "error",
        }),
      ],
      exitOnError: config?.exitOnError || false,
    };
  },
};

export default config;
