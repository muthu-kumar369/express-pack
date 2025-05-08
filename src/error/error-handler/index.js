export class ErrorHandler {
  static handleGlobalError(err, req, res, next) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  static handleProcessError() {
    process.on("uncaughtException", (err) => {
      console.error("🔥 Uncaught Exception:", err);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });

    process.on("SIGINT", () => {
      console.log("⚠️ Process interrupted! Cleaning up...");
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.log("✅ Process terminated gracefully.");
      process.exit(0);
    });
  }

  static handleNotFoundRoute(req, res, next) {
    return res.status(400).json({
      status: "error",
      message: "Route not found!",
    });
  }
}
