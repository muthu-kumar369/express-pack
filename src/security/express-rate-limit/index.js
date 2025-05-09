import { rateLimit } from "express-rate-limit";
import rateLimitConfig from "../../config/security/expressRateLimitConfig.js";

class RateLimitHandler {
  static setupRateLimit({ app, customConfig = {} }) {
    const config = rateLimitConfig.getConfig(customConfig);

    app.use(rateLimit(config));
  }
}

export default RateLimitHandler;
