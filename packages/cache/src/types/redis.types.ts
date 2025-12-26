import type Redis from "ioredis";

export interface RedisSetOptions {
  expire?: number; // expiration time in seconds
}

export interface RedisClientOptions {
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;
  REDIS_DB?: number;
}

// Redis is the class itself (type), so RedisInstance can be Redis or null
export type RedisInstance = Redis | null;

export interface RedisClientStatic {
  instance: RedisClientService | null;
  redis: RedisInstance;
  connected: boolean;
  isRedisEnabled: boolean;

  enableRedis(enable?: boolean): void;
  init(): void;
  set(key: string, value: string, options?: RedisSetOptions): Promise<void>;
  get(key: string): Promise<string | null | undefined>;
  del(key: string): Promise<void>;
  expire(key: string, seconds: number): Promise<void>;
  keys(pattern?: string): Promise<string[] | undefined>;
  getClient(): RedisInstance;
  disconnect(): void;
}

export interface RedisClientService {
  constructor(): RedisClientService;
}
