import { Request, Response, NextFunction } from "express";

export type UserCallback = (
  req: Request
) => Promise<Record<string, any> | null>;

export class UserSessionInjector {
  /**
   * Injects user details into session using the provided callback.
   * @param callback - A function that receives the request and returns user data.
   */
  static inject(callback: UserCallback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userData = await callback(req);

        if (userData && typeof userData === "object") {
          if (!req.session) {
            throw new Error(
              "Session not initialized. Please add session middleware before using this."
            );
          }

          (req.session as any).user = userData;
        }
      } catch (error) {
        console.error(
          "[UserSessionInjector] Failed to inject user session:",
          error
        );
      }

      next();
    };
  }
}
