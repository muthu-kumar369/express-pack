// express-pack.types.ts

import { Router } from "express";

export type MiddlewareConfig = Record<string, any>;

export interface Route {
  path: string;
  route: Router;
}

export interface RouteGroup {
  prefix?: string;
  version?: string;
  route: Route[];
}

// Module augmentation for Express Request to add requestId
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string | string[];
  }
}
