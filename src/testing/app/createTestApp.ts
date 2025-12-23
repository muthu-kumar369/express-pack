import express, { Application, Router } from 'express';
import { ExpressPack } from '../../framework/express/index.js';
import type { MiddlewareConfig } from '../../framework/express/types/index.js';

export interface TestAppOptions {
    routes?: Router[];
    config?: MiddlewareConfig;
}

/**
 * Creates a test Express application with express-pack initialized
 * 
 * @param options - Test app configuration options
 * @param options.routes - Array of routers to mount
 * @param options.config - Middleware configuration
 * @returns Configured Express application
 * 
 * @example
 * ```typescript
 * import { createTestApp } from 'express-pack/testing';
 * 
 * const app = await createTestApp({
 *   routes: [userRouter],
 *   config: { cors: {}, bodyParser: {} }
 * });
 * ```
 * 
 * @category Testing
 */
export async function createTestApp(
    options: TestAppOptions = {}
): Promise<Application> {
    const { routes = [], config = {} } = options;

    const app = express();

    // Initialize with test config
    await ExpressPack.init({
        app,
        config: {
            bodyParser: {},
            cors: { origin: '*' },
            ...config,
        },
    });

    // Mount routes
    routes.forEach((router) => {
        app.use(router);
    });

    return app;
}
