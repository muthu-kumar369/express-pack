import { JWTUtil } from '../../util/jwt/index.js';

/**
 * Generates a test JWT token
 * 
 * @param payload - Token payload
 * @param secret - JWT secret (default: 'test-secret-key')
 * @param options - JWT options
 * @returns JWT token string
 * 
 * @example
 * ```typescript
 * import { generateTestToken } from 'express-pack/testing';
 * 
 * const token = generateTestToken({ userId: '123', role: 'admin' });
 * ```
 * 
 * @category Testing
 */
export function generateTestToken(
    payload: any,
    secret: string = 'test-secret-key',
    options: any = {}
): string {
    return JWTUtil.sign(
        payload,
        secret,
        { expiresIn: '1h', ...options }
    );
}

/**
 * Creates a test user payload
 * 
 * @param overrides - Properties to override
 * @returns User payload object
 * 
 * @example
 * ```typescript
 * import { createTestUser } from 'express-pack/testing';
 * 
 * const user = createTestUser({ role: 'admin' });
 * const token = generateTestToken(user);
 * ```
 * 
 * @category Testing
 */
export function createTestUser(overrides: any = {}) {
    return {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        ...overrides,
    };
}
