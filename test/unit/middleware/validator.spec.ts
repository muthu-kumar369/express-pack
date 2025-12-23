import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RequestValidator } from '../../../src/middleware/request-validator/index.js';
import { z } from 'zod';
import express, { Request, Response, NextFunction } from 'express';

describe('RequestValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let nextSpy: any;

    beforeEach(() => {
        nextSpy = vi.fn();
        next = nextSpy;

        req = {
            params: {},
            query: {},
            body: {},
        };

        res = {
            status: vi.fn(() => res) as any,
            json: vi.fn(),
        };
    });

    describe('validateRequest', () => {
        it('should validate valid request body', () => {
            const schema = {
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                }),
            };

            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
            expect((req as any).data).toBeDefined();
            expect((req as any).data.name).toBe('John Doe');
        });

        it('should validate request params', () => {
            const schema = {
                params: z.object({
                    id: z.string().uuid(),
                }),
            };

            req.params = {
                id: '123e4567-e89b-12d3-a456-426614174000',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
        });

        it('should validate request query', () => {
            const schema = {
                query: z.object({
                    page: z.string().transform(Number),
                    limit: z.string().transform(Number),
                }),
            };

            req.query = {
                page: '1',
                limit: '10',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
            expect((req as any).data.page).toBe(1);
            expect((req as any).data.limit).toBe(10);
        });

        it('should reject invalid data', () => {
            const schema = {
                body: z.object({
                    email: z.string().email(),
                }),
            };

            req.body = {
                email: 'invalid-email',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should handle missing required fields', () => {
            const schema = {
                body: z.object({
                    name: z.string(),
                    email: z.string(),
                }),
            };

            req.body = {
                name: 'John',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should validate nested objects', () => {
            const schema = {
                body: z.object({
                    user: z.object({
                        name: z.string(),
                        address: z.object({
                            city: z.string(),
                            zip: z.string(),
                        }),
                    }),
                }),
            };

            req.body = {
                user: {
                    name: 'John',
                    address: {
                        city: 'NYC',
                        zip: '10001',
                    },
                },
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
        });

        it('should validate arrays', () => {
            const schema = {
                body: z.object({
                    tags: z.array(z.string()),
                }),
            };

            req.body = {
                tags: ['tag1', 'tag2', 'tag3'],
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
        });

        it('should handle optional fields', () => {
            const schema = {
                body: z.object({
                    name: z.string(),
                    age: z.number().optional(),
                }),
            };

            req.body = {
                name: 'John',
            };

            const middleware = RequestValidator.validateRequest(schema);
            middleware(req as Request, res as Response, next);

            expect(nextSpy).toHaveBeenCalled();
        });
    });
});
