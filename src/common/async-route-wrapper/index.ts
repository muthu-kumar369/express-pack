import type { RequestHandler } from "express";
import { AsyncMiddleware } from "./types";

export class AsyncRouteWrapper {
  /**
   * Wraps any async/sync function and passes errors to Express
   * @param fn - controller or middleware function
   * @returns Express middleware
   */
  static asyncHandler(fn: AsyncMiddleware): RequestHandler {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
