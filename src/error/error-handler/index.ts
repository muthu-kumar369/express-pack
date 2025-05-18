import { Request, Response, NextFunction } from "express";

export class ErrorHandler {
  static handleGlobalError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  static handleProcessError(): void {
    process.on("uncaughtException", (err: Error) => {
      console.error("🔥 Uncaught Exception:", err);
      // process.exit(1); // it will stop or crash the app
    });

    process.on(
      "unhandledRejection",
      (reason: unknown, promise: Promise<unknown>) => {
        console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
        // process.exit(1); // it will stop or crash the app
      }
    );

    process.on("SIGINT", () => {
      console.log("⚠️ Process interrupted! Cleaning up...");
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.log("✅ Process terminated gracefully.");
      process.exit(0);
    });
  }

  static handleNotFoundRoute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    return res.status(400).json({
      status: "error",
      message: "Route not found!",
    });
  }
}
