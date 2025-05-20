import { Application } from "express";
import { rateLimit } from "express-rate-limit";

export interface ExpressRateLimitInitOptions {
  app: Application;
  customConfig?: Partial<Parameters<typeof rateLimit>[0]>;
}
