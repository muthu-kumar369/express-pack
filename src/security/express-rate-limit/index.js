import { rateLimit } from "express-rate-limit";
import rateLimitConfig from "../../config/security/expressRateLimitConfig.js";

export class RateLimitHandler {
  static setupRateLimit({ app, customConfig = {} }) {
    const config = rateLimitConfig.getConfig(customConfig);

    app.use(rateLimit(config));
  }
}
