import { z, ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  ValidatedRequest,
  ValidateRequestOptions,
} from "../types/request-validator.types";

/**
 * RequestValidator provides middleware for validating request data using Zod schemas.
 * 
 * Validates request parameters, query strings, and body data against defined schemas,
 * automatically parsing and type-checking incoming data before it reaches route handlers.
 * 
 * @example
 * ```typescript
 * import { RequestValidator, z } from 'express-pack';
 * 
 * // Define validation schema
 * const userSchema = {
 *   body: z.object({
 *     name: z.string().min(2),
 *     email: z.string().email(),
 *     age: z.number().min(18).optional()
 *   }),
 *   params: z.object({
 *     id: z.string().uuid()
 *   })
 * };
 * 
 * // Apply validation middleware
 * router.post('/users/:id',
 *   RequestValidator.validateRequest(userSchema),
 *   (req, res) => {
 *     // req.data contains validated and typed data
 *     const { name, email, age } = req.data;
 *     res.json({ success: true });
 *   }
 * );
 * ```
 * 
 * @category Middleware
 */
export class RequestValidator {
  /**
   * Creates middleware that validates request data against Zod schemas.
   * 
   * Validates `req.params`, `req.query`, and `req.body` against provided schemas.
   * Parsed and validated data is attached to `req.data` for use in route handlers.
   * 
   * @param options - Validation schema options
   * @param options.params - Zod schema for URL parameters
   * @param options.query - Zod schema for query string parameters
   * @param options.body - Zod schema for request body
   * @returns Express middleware function
   * 
   * @throws {400} If validation fails, returns flattened Zod error details
   * @throws {500} If an unexpected error occurs during validation
   * 
   * @example
   * ```typescript
   * import { RequestValidator, z } from 'express-pack';
   * 
   * // Validate all three: params, query, and body
   * router.put('/users/:id',
   *   RequestValidator.validateRequest({
   *     params: z.object({
   *       id: z.string().uuid()
   *     }),
   *     query: z.object({
   *       force: z.boolean().optional()
   *     }),
   *     body: z.object({
   *       name: z.string().min(2),
   *       email: z.string().email()
   *     })
   *   }),
   *   updateUser
   * );
   * 
   * // Validate only body
   * router.post('/posts',
   *   RequestValidator.validateRequest({
   *     body: z.object({
   *       title: z.string().min(5).max(100),
   *       content: z.string().min(10),
   *       tags: z.array(z.string()).optional(),
   *       published: z.boolean().default(false)
   *     })
   *   }),
   *   createPost
   * );
   * 
   * // Validate with custom types
   * const createUserSchema = z.object({
   *   name: z.string().min(2, 'Name must be at least 2 characters'),
   *   email: z.string().email('Invalid email format'),
   *   password: z.string()
   *     .min(8, 'Password must be at least 8 characters')
   *     .regex(/[A-Z]/, 'Password must contain uppercase letter')
   *     .regex(/[0-9]/, 'Password must contain number'),
   *   role: z.enum(['user', 'admin', 'moderator']).default('user')
   * });
   * 
   * router.post('/register',
   *   RequestValidator.validateRequest({ body: createUserSchema }),
   *   (req, res) => {
   *     // req.data is fully typed based on schema
   *     const { name, email, password, role } = req.data;
   *     // Create user...
   *   }
   * );
   * 
   * // Nested object validation
   * router.post('/orders',
   *   RequestValidator.validateRequest({
   *     body: z.object({
   *       customer: z.object({
   *         name: z.string(),
   *         email: z.string().email()
   *       }),
   *       items: z.array(z.object({
   *         productId: z.string(),
   *         quantity: z.number().positive()
   *       })).min(1, 'At least one item required'),
   *       shippingAddress: z.object({
   *         street: z.string(),
   *         city: z.string(),
   *         zipCode: z.string().regex(/^\d{5}$/)
   *       })
   *     })
   *   }),
   *   createOrder
   * );
   * ```
   */
  static validateRequest({ params, query, body }: ValidateRequestOptions) {
    return (req: ValidatedRequest, res: Response, next: NextFunction) => {
      try {
        const parsed = {
          ...(params ? params.parse(req.params) : {}),
          ...(query ? query.parse(req.query) : {}),
          ...(body ? body.parse(req.body) : {}),
        };

        req.data = parsed;
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({ error: err.flatten() });
        }

        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
}
