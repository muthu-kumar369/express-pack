import Redis from "ioredis";
import type { RedisSetOptions, RedisInstance } from "../types";

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

  static enableRedis(enable = true): void {
    RedisClientService.isRedisEnabled = enable;
    if (enable) {
      RedisClientService.init();
    } else {
      RedisClientService.disconnect();
    }
  }

  static init(): void {
    if (RedisClientService.isRedisEnabled && !RedisClientService.connected) {
      RedisClientService.redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB) || 0,
      });

      RedisClientService.redis.on("connect", () => {
        RedisClientService.connected = true;
        console.log("Connected to Redis");
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
      console.log("Redis is disabled. Skipping set operation.");
      return;
    }
    try {
      if (options?.expire) {
        await RedisClientService.redis!.set(key, value, "EX", options.expire);
      } else {
        await RedisClientService.redis!.set(key, value);
      }
      console.log(`Key "${key}" set successfully.`);
    } catch (err) {
      console.error("Error setting key:", err);
    }
  }

  static async get(key: string): Promise<string | null | undefined> {
    if (!RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping get operation.");
      return;
    }
    try {
      const value = await RedisClientService.redis!.get(key);
      if (value === null) {
        console.log(`Key "${key}" not found.`);
        return null;
      }
      return value;
    } catch (err) {
      console.error("Error getting key:", err);
    }
  }

  static async del(key: string): Promise<void> {
    if (!RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping delete operation.");
      return;
    }
    try {
      const result = await RedisClientService.redis!.del(key);
      if (result === 1) {
        console.log(`Key "${key}" deleted successfully.`);
      } else {
        console.log(`Key "${key}" not found.`);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  }

  static async expire(key: string, seconds: number): Promise<void> {
    if (!RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping expiration operation.");
      return;
    }
    try {
      await RedisClientService.redis!.expire(key, seconds);
      console.log(`Key "${key}" will expire in ${seconds} seconds.`);
    } catch (err) {
      console.error("Error setting expiration:", err);
    }
  }

  static async keys(pattern = "*"): Promise<string[] | undefined> {
    if (!RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping keys operation.");
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
      console.log("Redis is disabled. Returning null client.");
      return null;
    }
    return RedisClientService.redis;
  }

  static disconnect(): void {
    if (RedisClientService.redis) {
      RedisClientService.redis.disconnect();
      console.log("Disconnected from Redis");
    }
    RedisClientService.connected = false;
  }
}
