const { format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

module.exports = {
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
};
