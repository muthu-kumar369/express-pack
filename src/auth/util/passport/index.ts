import passport from "passport";
import {
  PassportStrategyConfig,
  SerializeUserFn,
  DeserializeUserFn,
} from "@/auth/types/util/passport.util.types";
import { Application } from "express";
// import { Strategy } from "passport";
// import { Express } from "express";

export class PassportService {
  private static initialized = false;

  /**
   * Initialize passport with strategies, serialization and deserialization
   */
  public static init(config: {
    strategies: PassportStrategyConfig[];
    serializeUser?: SerializeUserFn;
    deserializeUser?: DeserializeUserFn;
  }): void {
    if (this.initialized) return;

    // Register all strategies
    for (const { name, strategy } of config.strategies) {
      passport.use(name, strategy);
    }

    // Setup serialization
    passport.serializeUser(
      config.serializeUser ?? ((user, done) => done(null, (user as any).id))
    );

    passport.deserializeUser(
      config.deserializeUser ?? ((id, done) => done(null, { id })) // Default dummy, should be overridden
    );

    this.initialized = true;
  }

  /**
   * Returns the passport middleware to be plugged into Express
   */
  public static initialize({ app }: { app: Application }) {
    app.use(passport.initialize());
  }

  /**
   * Returns the passport session middleware (optional)
   */
  public static session({ app }: { app: Application }) {
    app.use(passport.session());
  }
}
