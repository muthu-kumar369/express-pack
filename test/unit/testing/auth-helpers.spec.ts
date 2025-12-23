import { describe, it, expect } from 'vitest';
import { generateTestToken, createTestUser } from '../../../src/testing/helpers/auth.js';
import { JWTUtil } from '../../../src/util/jwt/index.js';

describe('Auth Helpers', () => {
    describe('generateTestToken', () => {
        it('should generate a valid JWT token', () => {
            const payload = { userId: '123', role: 'user' };
            const token = generateTestToken(payload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should create token with custom secret', () => {
            const payload = { userId: '123' };
            const secret = 'custom-secret';
            const token = generateTestToken(payload, secret);

            const decoded = JWTUtil.verify(token, secret);
            expect(decoded.userId).toBe('123');
        });

        it('should include expiration by default', () => {
            const payload = { userId: '123' };
            const token = generateTestToken(payload);

            const decoded = JWTUtil.verify(token, 'test-secret-key') as any;
            expect(decoded.exp).toBeDefined();
        });
    });

    describe('createTestUser', () => {
        it('should create default test user', () => {
            const user = createTestUser();

            expect(user).toEqual({
                id: '123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'user',
            });
        });

        it('should allow overriding properties', () => {
            const user = createTestUser({
                id: '456',
                role: 'admin',
                customField: 'value',
            });

            expect(user.id).toBe('456');
            expect(user.role).toBe('admin');
            expect(user.customField).toBe('value');
            expect(user.email).toBe('test@example.com'); // Default preserved
        });
    });
});
