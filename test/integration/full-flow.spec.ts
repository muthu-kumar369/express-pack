import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    createTestApp,
    createTestRequest,
    generateTestToken,
    createAuthenticatedRequest,
    setupMongooseMock,
    teardownMongooseMock,
} from '../../../src/testing/index.js';
import express, { Router } from 'express';

describe('Integration Tests', () => {
    describe('Full Route Flow with Auth', () => {
        it('should handle authenticated request flow', async () => {
            const router = Router();
            router.get('/protected', (req, res) => {
                res.json({ message: 'success', user: req.user });
            });

            const app = await createTestApp({ routes: [router] });
            const token = generateTestToken({ userId: '123', role: 'user' });
            const request = createAuthenticatedRequest(app, token);

            const res = await request.get('/protected');
            expect(res.status).toBe(200);
        });

        it('should handle request with validation', async () => {
            const router = Router();
            router.post('/users', (req, res) => {
                res.status(201).json({ success: true, data: req.body });
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request
                .post('/users')
                .send({ name: 'John', email: 'john@example.com' });

            expect(res.status).toBe(201);
        });
    });

    describe('Error Handling Flow', () => {
        it('should handle 404 errors', async () => {
            const app = await createTestApp();
            const request = createTestRequest(app);

            const res = await request.get('/nonexistent');
            expect(res.status).toBe(404);
        });

        it('should handle validation errors', async () => {
            const router = Router();
            router.post('/users', (req, res) => {
                if (!req.body.email) {
                    return res.status(400).json({ error: 'Email required' });
                }
                res.json({ success: true });
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.post('/users').send({ name: 'John' });
            expect(res.status).toBe(400);
        });
    });

    describe('CRUD Operations', () => {
        beforeEach(async () => {
            await setupMongooseMock();
        });

        afterEach(async () => {
            await teardownMongooseMock();
        });

        it('should handle create operation', async () => {
            const router = Router();
            router.post('/items', (req, res) => {
                res.status(201).json({ id: '1', ...req.body });
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.post('/items').send({ name: 'Item 1' });
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Item 1');
        });

        it('should handle read operation', async () => {
            const router = Router();
            router.get('/items/:id', (req, res) => {
                res.json({ id: req.params.id, name: 'Item 1' });
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.get('/items/1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe('1');
        });

        it('should handle update operation', async () => {
            const router = Router();
            router.put('/items/:id', (req, res) => {
                res.json({ id: req.params.id, ...req.body });
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.put('/items/1').send({ name: 'Updated' });
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated');
        });

        it('should handle delete operation', async () => {
            const router = Router();
            router.delete('/items/:id', (req, res) => {
                res.status(204).send();
            });

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.delete('/items/1');
            expect(res.status).toBe(204);
        });
    });
});
