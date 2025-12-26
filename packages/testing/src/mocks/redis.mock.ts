/**
 * Mock Redis client for testing
 */
export class MockRedisClient {
    private store: Map<string, any> = new Map();

    async get(key: string): Promise<string | null> {
        return this.store.get(key) || null;
    }

    async set(key: string, value: any, options?: any): Promise<'OK'> {
        this.store.set(key, value);
        return 'OK';
    }

    async del(key: string): Promise<number> {
        const existed = this.store.has(key);
        this.store.delete(key);
        return existed ? 1 : 0;
    }

    async exists(key: string): Promise<number> {
        return this.store.has(key) ? 1 : 0;
    }

    async flushall(): Promise<'OK'> {
        this.store.clear();
        return 'OK';
    }
}

export function createMockRedis() {
    return new MockRedisClient();
}
