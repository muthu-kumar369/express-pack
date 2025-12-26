import cors, { CorsOptions } from "cors";
import corsConfig from "../../config/common/corsConfig";
import { CorsCustomConfig, OriginCallback } from "./types";

/**
 * Cors class used to setup the cors origin
 */
export class Cors {
  static defaultConfig: CorsOptions;
  static customConfig: CorsCustomConfig;

  /**
   * Used to setup the cors for app
   * @param app Express app
   * @param customConfig config for cors
   */
  static init({
    app,
    customConfig = {},
  }: {
    app: any;
    customConfig?: Partial<CorsCustomConfig>;
  }) {
    this.customConfig = corsConfig.getConfig(customConfig);

    const config =
      Object.keys(customConfig || {}).length > 0
        ? this.getCorsConfig()
        : { ...this.defaultConfig };

    app.use(cors(config));
  }

  /**
   * Used to check allow origin, block origin and return the config
   * @returns config details for cors
   */
  static getCorsConfig(): CorsOptions {
    const {
      allowOrigins = [],
      blockOrigins = [],
      ...remainConfig
    } = this.customConfig;

    const originHandler = (
      origin: string | undefined,
      callback: OriginCallback
    ) => {
      if (!origin) return callback(null, true);

      if (
        blockOrigins.some(
          (blocked) =>
            typeof blocked !== "boolean" &&
            this.matchOrigin({ origin, pattern: blocked })
        )
      ) {
        return callback(new Error("Blocked by CORS policy"));
      }

      if (
        allowOrigins.length === 0 ||
        allowOrigins.some(
          (allowed) =>
            typeof allowed !== "boolean" &&
            this.matchOrigin({ origin, pattern: allowed })
        )
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS policy"));
    };

    return {
      ...this.defaultConfig,
      ...remainConfig,
      origin: originHandler,
    };
  }

  /**
   * Used to check whether origin is allowed
   */
  static matchOrigin({
    origin,
    pattern,
  }: {
    origin: string;
    pattern: string | RegExp;
  }): boolean {
    if (typeof pattern === "string") return origin === pattern;
    if (pattern instanceof RegExp) return pattern.test(origin);
    return false;
  }
}
