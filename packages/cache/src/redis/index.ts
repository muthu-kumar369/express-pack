import Redis from "ioredis";
import type {
  RedisSetOptions,
  RedisInstance,
  RedisClientOptions,
} from "../types/redis.types";

/**
 * RedisClientService provides a singleton wrapper for Redis operations.
 * 
 * Manages Redis connection lifecycle and provides convenient methods for
 * common caching operations including get, set, delete, expiration, and key listing.
 * 
 * @example
 * ```typescript
 * import { RedisClientService } from 'express-pack';
 * 
 * // Enable and configure Redis
 * RedisClientService.enableRedis(true, {
 *   REDIS_HOST: '127.0.0.1',
 *   REDIS_PORT: 6379,
 *   REDIS_PASSWORD: 'your-password',
 *   REDIS_DB: 0
 * });
 * 
 * // Cache data with TTL
 * await RedisClientService.set('user:123', JSON.stringify(userData), {
 *   expire: 3600 // 1 hour
 * });
 * 
 * // Retrieve cached data
 * const cached = await RedisClientService.get('user:123');
 * const user = cached ? JSON.parse(cached) : null;
 * ```
 * 
 * @category Services
 */
export class RedisClientService {
  static instance: RedisClientService | null = null;
  static redis: RedisInstance = null;
  static connected = false;
  static isRedisEnabled = false;

  constructor() {
    if (RedisClientService.instance) {
      return RedisClientService.instance;
    }
    RedisClientService.instance = this;
  }

  /**
   * Enables or disables Redis and initializes connection if enabled.
   * 
   * @param enable - Whether to enable Redis (default: true)
   * @param config - Redis connection configuration
   * @param config.REDIS_HOST - Redis server host
   * @param config.REDIS_PORT - Redis server port
   * @param config.REDIS_PASSWORD - Redis password (optional)
   * @param config.REDIS_DB - Redis database number (default: 0)
   * 
   * @example
   * ```typescript
   * // Enable Redis
   * RedisClientService.enableRedis(true, {
   *   REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
   *   REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
   *   REDIS_PASSWORD: process.env.REDIS_PASSWORD,
   *   REDIS_DB: 0
   * });
   * 
   * // Disable Redis
   * RedisClientService.enableRedis(false, {});
   * ```
   */
  static enableRedis(enable = true, config: RedisClientOptions): void {
    RedisClientService.isRedisEnabled = enable;
    if (enable) {
      RedisClientService.init(config);
    } else {
      RedisClientService.disconnect();
    }
  }

  /**
   * Initializes Redis connection with provided configuration.
   * 
   * @param config - Redis connection configuration
   * 
   * @private
   */
  static init(config: RedisClientOptions): void {
    if (RedisClientService.isRedisEnabled && !RedisClientService.connected) {
      RedisClientService.redis = new Redis({
        host: config.REDIS_HOST || "localhost",
        port: Number(config.REDIS_PORT) || 6379,
        password: config.REDIS_PASSWORD || undefined,
        db: Number(config.REDIS_DB) || 0,
      });

      RedisClientService.redis.on("connect", () => {
        RedisClientService.connected = true;
        console.info("Connected to Redis");
      });

      RedisClientService.redis.on("error", (err: any) => {
        console.error("Redis connection error: ", err);
        RedisClientService.connected = false;
      });
    }
  }

  /**
   * Sets a key-value pair in Redis with optional expiration.
   * 
   * @param key - Redis key
   * @param value - Value to store (must be string)
   * @param options - Set options
   * @param options.expire - TTL in seconds (optional)
   * 
   * @example
   * ```typescript
   * // Set without expiration
   * await RedisClientService.set('config:theme', 'dark');
   * 
   * // Set with 1 hour expiration
   * await RedisClientService.set('session:abc123', JSON.stringify(sessionData), {
   *   expire: 3600
   * });
   * 
   * // Cache-aside pattern
   * const cacheKey = `user:${userId}`;
   * const user = await User.findById(userId);
   * await RedisClientService.set(cacheKey, JSON.stringify(user), {
   *   expire: 300 // 5 minutes
   * });
   * ```
   */
  static async set(
    key: string,
    value: string,
    options?: RedisSetOptions
  ): Promise<void> {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping set operation.");
      return;
    }
    try {
      if (options?.expire) {
        await RedisClientService.redis!.set(key, value, "EX", options.expire);
      } else {
        await RedisClientService.redis!.set(key, value);
      }
      console.info(`Key "${key}" set successfully.`);
    } catch (err) {
      console.error("Error setting key:", err);
    }
  }

  /**
   * Retrieves a value from Redis by key.
   * 
   * @param key - Redis key to retrieve
   * @returns The value if found, null if not found, undefined if Redis is disabled
   * 
   * @example
   * ```typescript
   * // Simple get
   * const value = await RedisClientService.get('config:theme');
   * 
   * // Get with JSON parsing
   * const cached = await RedisClientService.get('user:123');
   * const user = cached ? JSON.parse(cached) : null;
   * 
   * // Cache-aside pattern with fallback
   * async function getUser(userId: string) {
   *   const cacheKey = `user:${userId}`;
   *   const cached = await RedisClientService.get(cacheKey);
   *   
   *   if (cached) {
   *     return JSON.parse(cached);
   *   }
   *   
   *   const user = await User.findById(userId);
   *   await RedisClientService.set(cacheKey, JSON.stringify(user), {
   *     expire: 300
   *   });
   *   
   *   return user;
   * }
   * ```
   */
  static async get(key: string): Promise<string | null | undefined> {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping get operation.");
      return;
    }
    try {
      const value = await RedisClientService.redis!.get(key);
      if (value === null) {
        console.info(`Key "${key}" not found.`);
        return null;
      }
      return value;
    } catch (err) {
      console.error("Error getting key:", err);
    }
  }

  /**
   * Deletes a key from Redis.
   * 
   * @param key - Redis key to delete
   * 
   * @example
   * ```typescript
   * // Delete single key
   * await RedisClientService.del('session:abc123');
   * 
   * // Cache invalidation on update
   * async function updateUser(userId: string, updates: any) {
   *   const user = await User.findByIdAndUpdate(userId, updates);
   *   await RedisClientService.del(`user:${userId}`); // Invalidate cache
   *   return user;
   * }
   * ```
   */
  static async del(key: string): Promise<void> {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping delete operation.");
      return;
    }
    try {
      const result = await RedisClientService.redis!.del(key);
      if (result === 1) {
        console.info(`Key "${key}" deleted successfully.`);
      } else {
        console.info(`Key "${key}" not found.`);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  }

  /**
   * Sets expiration time on an existing key.
   * 
   * @param key - Redis key
   * @param seconds - TTL in seconds
   * 
   * @example
   * ```typescript
   * // Set expiration on existing key
   * await RedisClientService.expire('session:abc123', 1800); // 30 minutes
   * 
   * // Extend session timeout
   * async function extendSession(sessionId: string) {
   *   await RedisClientService.expire(`session:${sessionId}`, 3600);
   * }
   * ```
   */
  static async expire(key: string, seconds: number): Promise<void> {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping expiration operation.");
      return;
    }
    try {
      await RedisClientService.redis!.expire(key, seconds);
      console.info(`Key "${key}" will expire in ${seconds} seconds.`);
    } catch (err) {
      console.error("Error setting expiration:", err);
    }
  }

  /**
   * Lists all keys matching a pattern.
   * 
   * @param pattern - Redis key pattern (default: '*' for all keys)
   * @returns Array of matching keys
   * 
   * @example
   * ```typescript
   * // Get all keys
   * const allKeys = await RedisClientService.keys('*');
   * 
   * // Get keys with pattern
   * const userKeys = await RedisClientService.keys('user:*');
   * const sessionKeys = await RedisClientService.keys('session:*');
   * 
   * // Clear all user cache
   * const keys = await RedisClientService.keys('user:*');
   * for (const key of keys) {
   *   await RedisClientService.del(key);
   * }
   * ```
   */
  static async keys(pattern = "*"): Promise<string[] | undefined> {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping keys operation.");
      return [];
    }
    try {
      const keys = await RedisClientService.redis!.keys(pattern);
      return keys;
    } catch (err) {
      console.error("Error retrieving keys:", err);
    }
  }

  /**
   * Returns the underlying Redis client instance for advanced operations.
   * 
   * @returns Redis client instance or null if disabled
   * 
   * @example
   * ```typescript
   * // Get client for advanced operations
   * const client = RedisClientService.getClient();
   * 
   * if (client) {
   *   // Use Redis pipeline
   *   const pipeline = client.pipeline();
   *   pipeline.set('key1', 'value1');
   *   pipeline.set('key2', 'value2');
   *   await pipeline.exec();
   *   
   *   // Use Redis transactions
   *   await client.multi()
   *     .set('key1', 'value1')
   *     .set('key2', 'value2')
   *     .exec();
   * }
   * ```
   */
  static getClient(): RedisInstance {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Returning null client.");
      return null;
    }
    return RedisClientService.redis;
  }

  /**
   * Disconnects from Redis server.
   * 
   * @example
   * ```typescript
   * // Graceful shutdown
   * process.on('SIGTERM', () => {
   *   RedisClientService.disconnect();
   *   process.exit(0);
   * });
   * ```
   */
  static disconnect(): void {
    if (RedisClientService.redis) {
      RedisClientService.redis.disconnect();
      console.info("Disconnected from Redis");
    }
    RedisClientService.connected = false;
  }
}
