import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

/**
 * Convert Zod schema to OpenAPI schema
 */
export function zodToOpenAPI(zodSchema: any): any {
    if (!zodSchema) {
        return { type: 'object' };
    }

    // Use zod-to-openapi for conversion
    try {
        if (zodSchema._def && zodSchema._def.openapi) {
            return zodSchema._def.openapi;
        }

        // Fallback for basic types
        const zodType = zodSchema._def?.typeName;

        switch (zodType) {
            case 'ZodString':
                return { type: 'string' };
            case 'ZodNumber':
                return { type: 'number' };
            case 'ZodBoolean':
                return { type: 'boolean' };
            case 'ZodArray':
                return {
                    type: 'array',
                    items: zodToOpenAPI(zodSchema._def.type),
                };
            case 'ZodObject':
                const properties: any = {};
                const required: string[] = [];

                Object.entries(zodSchema._def.shape()).forEach(([key, value]: [string, any]) => {
                    properties[key] = zodToOpenAPI(value);
                    if (!value.isOptional()) {
                        required.push(key);
                    }
                });

                return {
                    type: 'object',
                    properties,
                    required: required.length > 0 ? required : undefined,
                };
            default:
                return { type: 'object' };
        }
    } catch (error) {
        return { type: 'object' };
    }
}
