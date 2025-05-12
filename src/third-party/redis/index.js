// redisClient.js
import Redis from "ioredis";

export class RedisClientService {
  static instance = null;
  static redis = null;
  static connected = false;

  // Flag to decide whether to initialize Redis
  static isRedisEnabled = false;

  constructor() {
    if (RedisClient.instance) {
      return RedisClient.instance; // Return the existing instance
    }
    RedisClient.instance = this; // Singleton instance
  }

  // Static method to enable or disable Redis connection
  static enableRedis(enable = true) {
    RedisClient.isRedisEnabled = enable;
    if (enable) {
      RedisClient.initialize();
    } else {
      RedisClient.disconnect();
    }
  }

  // Static method to initialize Redis connection lazily
  static init() {
    if (RedisClient.isRedisEnabled && !RedisClient.connected) {
      RedisClient.redis = new Redis({
        host: process?.env?.REDIS_HOST || "localhost",
        port: process?.env?.REDIS_PORT || 6379,
        password: process?.env?.REDIS_PASSWORD || null,
        db: process?.env?.REDIS_DB || 0,
      });

      RedisClient.redis.on("connect", () => {
        RedisClient.connected = true;
        console.log("Connected to Redis");
      });

      RedisClient.redis.on("error", (err) => {
        console.error("Redis connection error: ", err);
        RedisClient.connected = false;
      });
    }
  }

  // Static method to perform Redis operations
  static async set(key, value, options = {}) {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Skipping set operation.");
      return;
    }

    try {
      if (options?.expire) {
        await RedisClient.redis.set(key, value, "EX", options.expire || 3600);
      } else {
        await RedisClient.redis.set(key, value);
      }
      console.log(`Key "${key}" set successfully.`);
    } catch (err) {
      console.error("Error setting key:", err);
    }
  }

  static async get(key) {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Skipping get operation.");
      return;
    }

    try {
      const value = await RedisClient.redis.get(key);
      if (value === null) {
        console.log(`Key "${key}" not found.`);
        return null;
      }
      return value;
    } catch (err) {
      console.error("Error getting key:", err);
    }
  }

  static async del(key) {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Skipping delete operation.");
      return;
    }

    try {
      const result = await RedisClient.redis.del(key);
      if (result === 1) {
        console.log(`Key "${key}" deleted successfully.`);
      } else {
        console.log(`Key "${key}" not found.`);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  }

  static async expire(key, seconds) {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Skipping expiration operation.");
      return;
    }

    try {
      await RedisClient.redis.expire(key, seconds);
      console.log(`Key "${key}" will expire in ${seconds} seconds.`);
    } catch (err) {
      console.error("Error setting expiration:", err);
    }
  }

  static async keys(pattern = "*") {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Skipping keys operation.");
      return [];
    }

    try {
      const keys = await RedisClient.redis.keys(pattern);
      return keys;
    } catch (err) {
      console.error("Error retrieving keys:", err);
    }
  }

  // Static method to get the Redis client directly (for advanced operations)
  static getClient() {
    if (!RedisClient.isRedisEnabled) {
      console.log("Redis is disabled. Returning null client.");
      return null;
    }
    return RedisClient.redis;
  }

  // Static method to disconnect Redis connection
  static disconnect() {
    if (RedisClient.redis) {
      RedisClient.redis.disconnect();
      console.log("Disconnected from Redis");
    }
    RedisClient.connected = false;
  }
}
