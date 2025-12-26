/**
 * OpenAPI/Swagger Integration Module
 * 
 * Provides automatic API documentation generation using OpenAPI 3.0
 * 
 * @example
 * ```typescript
 * import { OpenAPIGenerator, setupSwaggerUI } from 'express-pack';
 * 
 * const generator = new OpenAPIGenerator({
 *   info: {
 *     title: 'My API',
 *     version: '1.0.0',
 *   },
 * });
 * 
 * const spec = generator.generate(routes);
 * setupSwaggerUI(app, spec, '/api-docs');
 * ```
 * 
 * @module openapi
 */

export { OpenAPIGenerator } from './generator.js';
export { setupSwaggerUI } from './ui.js';
export { zodToOpenAPI } from './zod-converter.js';
export type { OpenAPIConfig, RouteMetadata, OpenAPISpec } from './types.js';
