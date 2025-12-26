import express, { Application, Router } from 'express';

export interface TestAppOptions {
    routes?: Router[];
}

/**
 * Creates a test Express application
 * 
 * @param options - Test app configuration options
 * @param options.routes - Array of routers to mount
 * @returns Configured Express application
 */
export async function createTestApp(
    options: TestAppOptions = {}
): Promise<Application> {
    const { routes = [] } = options;

    const app = express();

    // Mount routes
    routes.forEach((router) => {
        app.use(router);
    });

    return app;
}
