import Redis from "ioredis";
import type {
  RedisSetOptions,
  RedisInstance,
  RedisClientOptions,
} from "../../../third-party/types";

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

  static enableRedis(enable = true, config: RedisClientOptions): void {
    RedisClientService.isRedisEnabled = enable;
    if (enable) {
      RedisClientService.init(config);
    } else {
      RedisClientService.disconnect();
    }
  }

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

  static getClient(): RedisInstance {
    if (!RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Returning null client.");
      return null;
    }
    return RedisClientService.redis;
  }

  static disconnect(): void {
    if (RedisClientService.redis) {
      RedisClientService.redis.disconnect();
      console.info("Disconnected from Redis");
    }
    RedisClientService.connected = false;
  }
}
