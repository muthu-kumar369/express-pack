import { describe, it, expect, beforeEach } from 'vitest';
import { JWTUtil } from '../../../src/util/jwt/index.js';

describe('JWT Utilities', () => {
    const secret = 'test-secret';
    const payload = { userId: '123', role: 'user' };

    describe('sign', () => {
        it('should create a valid JWT token', () => {
            const token = JWTUtil.sign(payload, secret);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        it('should include payload data', () => {
            const token = JWTUtil.sign(payload, secret);
            const decoded = JWTUtil.verify(token, secret) as any;

            expect(decoded.userId).toBe('123');
            expect(decoded.role).toBe('user');
        });

        it('should set expiration when provided', () => {
            const token = JWTUtil.sign(payload, secret, { expiresIn: '1h' });
            const decoded = JWTUtil.verify(token, secret) as any;

            expect(decoded.exp).toBeDefined();
            expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
        });

        it('should include issuer when provided', () => {
            const token = JWTUtil.sign(payload, secret, { issuer: 'test-app' });
            const decoded = JWTUtil.verify(token, secret) as any;

            expect(decoded.iss).toBe('test-app');
        });
    });

    describe('verify', () => {
        it('should verify valid token', () => {
            const token = JWTUtil.sign(payload, secret);
            const decoded = JWTUtil.verify(token, secret);

            expect(decoded).toBeDefined();
            expect((decoded as any).userId).toBe('123');
        });

        it('should throw on invalid signature', () => {
            const token = JWTUtil.sign(payload, secret);

            expect(() => {
                JWTUtil.verify(token, 'wrong-secret');
            }).toThrow();
        });

        it('should throw on expired token', () => {
            const token = JWTUtil.sign(payload, secret, { expiresIn: '0s' });

            // Wait a bit to ensure expiration
            return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                expect(() => {
                    JWTUtil.verify(token, secret);
                }).toThrow();
            });
        });

        it('should throw on malformed token', () => {
            expect(() => {
                JWTUtil.verify('invalid.token.here', secret);
            }).toThrow();
        });
    });

    describe('decode', () => {
        it('should decode token without verification', () => {
            const token = JWTUtil.sign(payload, secret);
            const decoded = JWTUtil.decode(token);

            expect(decoded).toBeDefined();
            expect((decoded as any).userId).toBe('123');
        });

        it('should decode expired token', () => {
            const token = JWTUtil.sign(payload, secret, { expiresIn: '0s' });

            // decode should work even if expired
            const decoded = JWTUtil.decode(token);
            expect(decoded).toBeDefined();
        });
    });
});
