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

import "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        requestId?: string | string[];
    }
}
