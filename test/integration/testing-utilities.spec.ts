import { describe, it, expect } from 'vitest';
import { createTestApp, createTestRequest } from '../../../src/testing/index.js';

describe('Testing Utilities', () => {
    describe('createTestApp', () => {
        it('should create Express app with express-pack initialized', async () => {
            const app = await createTestApp();

            expect(app).toBeDefined();
            expect(typeof app.use).toBe('function');
            expect(typeof app.get).toBe('function');
        });

        it('should mount provided routes', async () => {
            const router = (await import('express')).default.Router();
            router.get('/test', (req, res) => res.json({ success: true }));

            const app = await createTestApp({ routes: [router] });
            const request = createTestRequest(app);

            const res = await request.get('/test');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should apply custom config', async () => {
            const app = await createTestApp({
                config: {
                    bodyParser: { json: { limit: '5mb' } },
                },
            });

            expect(app).toBeDefined();
        });
    });

    describe('createTestRequest', () => {
        it('should create supertest instance', async () => {
            const app = await createTestApp();
            const request = createTestRequest(app);

            expect(request).toBeDefined();
            expect(typeof request.get).toBe('function');
            expect(typeof request.post).toBe('function');
        });
    });
});
