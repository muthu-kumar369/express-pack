// CronManager.ts
import cron from "node-cron";
import axios, { AxiosRequestConfig } from "axios";
import Redis from "ioredis";
import { Db } from "mongodb";
import { ScheduledTask } from "node-cron";

export type PersistService = "redis" | "mongodb";

export interface CronApiConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface JobOptions {
  runOnInit?: boolean;
  retry?: number;
  lockTimeout?: number;
}

export interface CronJobDefinition {
  name: string;
  cronExpression: string;
  apiConfig: CronApiConfig;
  options?: JobOptions;
  scheduledTask?: ScheduledTask | null;
  state?: "pending" | "running" | "paused" | "success" | "failed" | "stopped";
}

export interface CronManagerConstructorParams {
  serviceName: string;
  redis?: Redis | null;
  persistent?: boolean;
  timezone?: string;
  persistService?: PersistService;
  mongoClient?: Db;
}

// --- Module augmentation to fix node-cron types ---
declare module "node-cron" {
  interface ScheduledTask {
    running: boolean;
    destroy(): void;
  }
}

// Extend the Options interface from node-cron to add 'scheduled' and 'timezone'
export interface ExtendedCronOptions {
  scheduled?: boolean;
  timezone?: string;
  // add other node-cron options if needed
}
