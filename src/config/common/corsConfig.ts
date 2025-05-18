import { CorsCustomConfig } from "@/common/cors/types";
import type { CorsOptions } from "cors";

const config = {
  corsConfig: {
    origin: (_origin: string | undefined, callback) => {
      callback(null, true);
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: undefined,
    exposedHeaders: [],
    credentials: false,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  } as CorsOptions,

  getConfig: (custom: CorsCustomConfig = {}): CorsOptions => {
    return {
      origin: (_origin, callback) => {
        callback(null, true);
      },
      methods: custom.methods || [
        "GET",
        "HEAD",
        "PUT",
        "PATCH",
        "POST",
        "DELETE",
      ],
      allowedHeaders: custom.allowedHeaders || undefined,
      exposedHeaders: custom.exposedHeaders || [],
      credentials: custom.credentials || false,
      maxAge: custom.maxAge || 86400,
      preflightContinue: custom.preflightContinue || false,
      optionsSuccessStatus: custom.optionsSuccessStatus || 204,
    };
  },
};

export default config;
