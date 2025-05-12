// security/expressRateLimit.js

import { rateLimit } from "express-rate-limit";
import rateLimitConfig from "../../config/security/expressRateLimitConfig.js";

export class RateLimitHandler {
  static #initialized = false;

  /**
   * Setup rate limit middleware on the app (once only)
   * @param {*} app Express app instance
   * @param {*} customConfig Optional custom rate limit config
   */
  static init({ app, customConfig = {} }) {
    if (this.#initialized) return;

    const config = rateLimitConfig.getConfig(customConfig);
    app.use(rateLimit(config));

    this.#initialized = true;
  }

  static isInitialized() {
    return this.#initialized;
  }
}
