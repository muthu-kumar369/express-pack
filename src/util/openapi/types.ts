/**
 * OpenAPI Type Definitions
 */

export interface OpenAPIConfig {
    enabled?: boolean;
    output?: string;
    ui?: string | false;
    info?: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    security?: any[];
}

export interface RouteMetadata {
    summary?: string;
    description?: string;
    tags?: string[];
    params?: any;
    query?: any;
    body?: any;
    response?: any;
    requiresAuth?: boolean;
}

export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    paths: Record<string, any>;
    components: {
        schemas: Record<string, any>;
        securitySchemes: Record<string, any>;
    };
}
