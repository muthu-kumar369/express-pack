import express, {
  NextFunction,
  Request,
  Response,
  Application,
  Router,
  RequestHandler,
} from "express";
import {
  CompressionHandler,
  LoggerHandler,
  RateLimitHandler,
} from "../../../app";
import { BodyParser, Cors, DotEnv } from "../../common/index";
import { SecurityHandler } from "../../common/security/index";
import { MiddlewareConfig, RouteGroup } from "./types";
import sessionConfig from "@/config/middleware/express-session.config";
import session, { SessionOptions } from "express-session";
import { OpenAPIGenerator, setupSwaggerUI, type OpenAPIConfig } from "../../util/openapi/index.js";

/**
 * ExpressPack is the main entry point for initializing and configuring
 * an Express application with pre-configured middleware and utilities.
 * 
 * It provides a centralized way to set up common middleware like CORS,
 * body parsing, logging, security headers, compression, and rate limiting.
 * 
 * @example
 * ```typescript
 * import { ExpressPack } from 'express-pack';
 * import express from 'express';
 * 
 * const app = express();
 * await ExpressPack.init({ 
 *   app, 
 *   config: { 
 *     cors: { origin: '*' },
 *     bodyParser: { json: { limit: '10mb' } },
 *     logger: { level: 'info' }
 *   } 
 * });
 * 
 * const router = ExpressPack.getRouter();
 * // Define routes...
 * 
 * ExpressPack.initRoutes({
 *   routes: [{
 *     prefix: '/api',
 *     version: '/v1',
 *     route: [{ path: '/users', route: router }]
 *   }]
 * });
 * ```
 * 
 * @category Framework
 */
export class ExpressPack {
  static #app: Application | null = null;
  static #initialized = false;

  /**
   * Initializes the Express application with provided middleware configuration.
   * This method must be called before using any other ExpressPack methods.
   * 
   * @param options - Configuration options
   * @param options.app - Express application instance
   * @param options.config - Middleware configuration object
   * @returns Promise that resolves to the configured Express application
   * 
   * @throws {Error} If app is already initialized (returns existing app instead)
   * 
   * @example
   * ```typescript
   * const app = express();
   * await ExpressPack.init({
   *   app,
   *   config: {
   *     cors: { origin: '*', credentials: true },
   *     bodyParser: { json: { limit: '10mb' } },
   *     logger: { level: 'debug' },
   *     security: { hsts: { maxAge: 31536000 } },
   *     compression: { level: 6 },
   *     'express-rate-limit': { windowMs: 15 * 60 * 1000, max: 100 }
   *   }
   * });
   * ```
   */
  static async init({
    app,
    config = {},
  }: {
    app: Application;
    config?: MiddlewareConfig;
  }): Promise<Application> {
    if (this.#initialized && this.#app) return this.#app;

    this.#app = app;

    // Add request ID middleware once
    this.#app.use((req: Request, res: Response, next: NextFunction) => {
      const requestId =
        req.headers["x-request-id"] ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader("X-Request-ID", requestId);
      next();
    });

    // use session with app
    const expressSessionConfig = sessionConfig.getConfig(config?.sessionConfig);

    this.#app.use(session(expressSessionConfig));

    for (const [key, value] of Object.entries(config)) {
      this.#applyMiddleware({ key, value });
    }

    this.#initialized = true;
    return this.#app;
  }

  /**
   * Internal middleware dispatcher that applies middleware based on configuration keys.
   * 
   * @private
   * @param options - Middleware options
   * @param options.key - Middleware identifier
   * @param options.value - Middleware configuration
   */
  static #applyMiddleware({ key, value }: { key: string; value: any }) {
    switch (key) {
      case "bodyParser":
        BodyParser.init({ app: this.#app!, customConfig: value });
        break;

      case "cors":
        Cors.init({ app: this.#app!, customConfig: value });
        break;

      case "env":
        DotEnv.init({ customPath: value });
        break;

      case "logger":
        LoggerHandler.init(value);
        this.#app!.use(LoggerHandler.middleware() as RequestHandler);
        break;

      case "security":
        SecurityHandler.init({ app: this.#app!, customConfig: value });
        break;

      case "compression":
        CompressionHandler.init({
          app: this.#app!,
          customConfig: value,
        });
        break;

      case "express-rate-limit":
        RateLimitHandler.init({
          app: this.#app!,
          customConfig: value,
        });
        break;

      default:
        console.warn(`[ExpressPack] Unknown middleware key: ${key}`);
    }
  }

  /**
   * Returns the initialized Express application instance.
   * 
   * @returns The configured Express application
   * @throws {Error} If app is not initialized. Call {@link init} first.
   * 
   * @example
   * ```typescript
   * const app = ExpressPack.getApp();
   * app.listen(3000, () => console.log('Server running'));
   * ```
   */
  static getApp(): Application {
    if (!this.#initialized || !this.#app) {
      throw new Error(
        "Express app not initialized. Call ExpressPack.init() first."
      );
    }
    return this.#app;
  }

  /**
   * Creates and returns a new Express Router instance.
   * 
   * @returns A new Express Router instance
   * 
   * @example
   * ```typescript
   * const router = ExpressPack.getRouter();
   * router.get('/users', (req, res) => {
   *   res.json({ users: [] });
   * });
   * ```
   */
  static getRouter(): Router {
    return express.Router();
  }

  /**
   * Registers route groups with the Express application.
   * Must be called after {@link init}.
   * 
   * @param options - Route configuration options
   * @param options.routes - Array of route groups with prefix, version, and routes
   * @param options.openapi - Optional OpenAPI configuration for automatic API documentation
   * 
   * @throws {Error} If app is not initialized
   * 
   * @example
   * ```typescript
   * const userRouter = ExpressPack.getRouter();
   * userRouter.get('/', getAllUsers);
   * 
   * ExpressPack.initRoutes({
   *   routes: [{
   *     prefix: '/api',
   *     version: '/v1',
   *     route: [
   *       { path: '/users', route: userRouter },
   *       { path: '/posts', route: postRouter }
   *     ]
   *   }],
   *   openapi: {
   *     enabled: true,
   *     output: './openapi.json',
   *     ui: '/api-docs',
   *     info: {
   *       title: 'My API',
   *       version: '1.0.0'
   *     }
   *   }
   * });
   * // Routes will be available at: /api/v1/users, /api/v1/posts
   * // API docs will be available at: /api-docs
   * ```
   */
  static initRoutes({
    routes = [],
    openapi
  }: {
    routes?: RouteGroup[];
    openapi?: OpenAPIConfig;
  }) {
    if (!this.#initialized || !this.#app) {
      throw new Error("Cannot bind routes before app initialization.");
    }

    routes.forEach(({ prefix = "", version = "", route: routeList = [] }) => {
      const basePath = prefix + version;

      routeList.forEach(({ path, route }) => {
        const fullPath = basePath ? basePath + path : path;
        this.#app!.use(fullPath, route);
      });
    });

    // Generate OpenAPI documentation if enabled
    if (openapi?.enabled) {
      const generator = new OpenAPIGenerator(openapi);
      const spec = generator.generate(routes);

      // Save specification to file if output path specified
      if (openapi.output) {
        generator.saveToFile(openapi.output);
      }

      // Setup Swagger UI if path specified
      if (openapi.ui && typeof openapi.ui === 'string') {
        setupSwaggerUI(this.#app, spec, openapi.ui);
      }
    }
  }

  /**
   * Checks if the Express application has been initialized.
   * 
   * @returns `true` if initialized, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (!ExpressPack.isInitialized()) {
   *   await ExpressPack.init({ app, config });
   * }
   * ```
   */
  static isInitialized(): boolean {
    return this.#initialized;
  }
}
