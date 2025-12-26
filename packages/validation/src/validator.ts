import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export function validate(schema: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            } else {
                next(error);
            }
        }
    };
}

/**
 * Validate request body
 */
export function validateBody(schema: ZodSchema) {
    return validate({ body: schema });
}

/**
 * Validate request query
 */
export function validateQuery(schema: ZodSchema) {
    return validate({ query: schema });
}

/**
 * Validate request params
 */
export function validateParams(schema: ZodSchema) {
    return validate({ params: schema });
}

// Re-export Zod for convenience
export { z, ZodSchema, ZodError } from 'zod';
