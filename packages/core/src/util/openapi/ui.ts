import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

/**
 * Setup Swagger UI for API documentation
 * 
 * @param app - Express application
 * @param spec - OpenAPI specification
 * @param path - UI path (default: /api-docs)
 * 
 * @example
 * ```typescript
 * setupSwaggerUI(app, spec, '/api-docs');
 * // Access at http://localhost:3000/api-docs
 * ```
 */
export function setupSwaggerUI(
    app: Application,
    spec: any,
    path: string = '/api-docs'
): void {
    app.use(
        path,
        swaggerUi.serve,
        swaggerUi.setup(spec, {
            customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .information-container { margin: 20px 0 }
      `,
            customSiteTitle: 'API Documentation',
            customfavIcon: '/favicon.ico',
        })
    );
}
