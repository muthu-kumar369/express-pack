import jwt from 'jsonwebtoken';

/**
 * Generates a test JWT token
 * 
 * @param payload - Token payload
 * @param secret - JWT secret (defaults to 'test-secret')
 * @returns JWT token
 */
export function generateTestToken(payload: any, secret: string = 'test-secret'): string {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
 * Decodes a JWT token without verification (for testing)
 */
export function decodeTestToken(token: string): any {
    return jwt.decode(token);
}
