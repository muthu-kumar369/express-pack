import type { CorsOptions } from "cors";

export type OriginPattern = string | boolean | RegExp; // include boolean here
export type OriginCallback = (
  err: Error | null,
  allowedOrigin?: string | boolean | RegExp | (string | boolean | RegExp)[]
) => void;

export interface CorsCustomConfig extends Omit<CorsOptions, "origin"> {
  allowOrigins?: OriginPattern[];
  blockOrigins?: OriginPattern[];
  origin?:
    | OriginPattern
    | OriginPattern[]
    | boolean
    | ((origin: string | undefined, callback: OriginCallback) => void);
}

export interface CorsHandlerParams {
  app: any;
  customConfig?: CorsCustomConfig;
}
