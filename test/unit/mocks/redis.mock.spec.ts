import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    setupRedisMock,
    clearRedisMock,
    getRedisMock,
    teardownRedisMock,
} from '../../../src/testing/mocks/redis.mock.js';

describe('Redis Mock', () => {
    beforeEach(() => {
        setupRedisMock();
    });

    afterEach(async () => {
        await teardownRedisMock();
    });

    it('should setup Redis mock', () => {
        const redis = getRedisMock();
        expect(redis).toBeDefined();
    });

    it('should set and get values', async () => {
        const redis = getRedisMock();
        await redis.set('key1', 'value1');

        const value = await redis.get('key1');
        expect(value).toBe('value1');
    });

    it('should delete values', async () => {
        const redis = getRedisMock();
        await redis.set('key1', 'value1');
        await redis.del('key1');

        const value = await redis.get('key1');
        expect(value).toBeNull();
    });

    it('should clear all data', async () => {
        const redis = getRedisMock();
        await redis.set('key1', 'value1');
        await redis.set('key2', 'value2');

        await clearRedisMock();

        const value1 = await redis.get('key1');
        const value2 = await redis.get('key2');
        expect(value1).toBeNull();
        expect(value2).toBeNull();
    });

    it('should handle expiration', async () => {
        const redis = getRedisMock();
        await redis.set('key1', 'value1', 'EX', 1);

        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 1100));

        const value = await redis.get('key1');
        expect(value).toBeNull();
    });
});
