import RedisMock from 'ioredis-mock';

let redisMockInstance: any = null;

/**
 * Sets up Redis mock for testing
 * 
 * @returns Redis mock instance
 * 
 * @example
 * ```typescript
 * import { setupRedisMock } from 'express-pack/testing';
 * 
 * beforeEach(() => {
 *   setupRedisMock();
 * });
 * ```
 * 
 * @category Testing
 */
export function setupRedisMock() {
    if (!redisMockInstance) {
        redisMockInstance = new RedisMock();
    }
    return redisMockInstance;
}

/**
 * Clears all Redis mock data
 * 
 * @example
 * ```typescript
 * import { clearRedisMock } from 'express-pack/testing';
 * 
 * afterEach(async () => {
 *   await clearRedisMock();
 * });
 * ```
 * 
 * @category Testing
 */
export async function clearRedisMock() {
    if (redisMockInstance) {
        await redisMockInstance.flushall();
    }
}

/**
 * Gets the Redis mock instance
 * 
 * @returns Redis mock instance
 * 
 * @category Testing
 */
export function getRedisMock() {
    return redisMockInstance;
}

/**
 * Tears down Redis mock
 * 
 * @category Testing
 */
export async function teardownRedisMock() {
    if (redisMockInstance) {
        await redisMockInstance.disconnect();
        redisMockInstance = null;
    }
}
