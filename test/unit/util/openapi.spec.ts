import { describe, it, expect } from 'vitest';
import { OpenAPIGenerator } from '../../../src/util/openapi/generator.js';
import { RouteGroup } from '../../../src/framework/express/types/index.js';

describe('OpenAPIGenerator', () => {
    describe('generate', () => {
        it('should generate valid OpenAPI 3.0 spec', () => {
            const generator = new OpenAPIGenerator({
                info: {
                    title: 'Test API',
                    version: '1.0.0',
                    description: 'Test API Description',
                },
            });

            const routes: RouteGroup[] = [];
            const spec = generator.generate(routes);

            expect(spec.openapi).toBe('3.0.0');
            expect(spec.info.title).toBe('Test API');
            expect(spec.info.version).toBe('1.0.0');
            expect(spec.paths).toBeDefined();
            expect(spec.components).toBeDefined();
        });

        it('should include security schemes', () => {
            const generator = new OpenAPIGenerator();
            const spec = generator.generate([]);

            expect(spec.components.securitySchemes).toBeDefined();
            expect(spec.components.securitySchemes.bearerAuth).toBeDefined();
            expect(spec.components.securitySchemes.bearerAuth.type).toBe('http');
        });

        it('should use default values when config not provided', () => {
            const generator = new OpenAPIGenerator();
            const spec = generator.generate([]);

            expect(spec.info.title).toBe('API Documentation');
            expect(spec.info.version).toBe('1.0.0');
            expect(spec.servers).toHaveLength(1);
            expect(spec.servers![0].url).toBe('http://localhost:3000');
        });
    });

    describe('saveToFile', () => {
        it('should throw error if spec not generated', () => {
            const generator = new OpenAPIGenerator();

            expect(() => {
                generator.saveToFile();
            }).toThrow('No specification generated');
        });
    });
});
