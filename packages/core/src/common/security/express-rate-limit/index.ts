import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";
import rateLimitConfig from "../../../config/security/expressRateLimitConfig";
import { ExpressRateLimitInitOptions } from "../types";

export class RateLimitHandler {
  static #initialized = false;
  static #rateLimiterMiddleware: RateLimitRequestHandler | null = null;

  /**
   * Setup rate limit middleware on the app (once only)
   * @param app Express app instance
   * @param customConfig Optional custom rate limit config
   */
  static init({ app, customConfig = {} }: ExpressRateLimitInitOptions): void {
    if (this.#initialized) return;

    const config = rateLimitConfig.getConfig(customConfig);
    this.#rateLimiterMiddleware = rateLimit(config);
    app.use(this.#rateLimiterMiddleware);

    this.#initialized = true;
  }

  static isInitialized(): boolean {
    return this.#initialized;
  }
}
