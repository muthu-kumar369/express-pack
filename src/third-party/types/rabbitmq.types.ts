import type { Channel, Connection, Options } from "amqplib";

export interface RabbitMQConfig {
  enabled: boolean;
  uri: string;
  prefetch?: number;
  exchanges?: ExchangeConfig[];
  queues?: QueueConfig[];
}

export interface ExchangeConfig {
  name: string;
  type: string; // e.g. "direct", "fanout", "topic"
  options?: Options.AssertExchange;
}

export interface QueueConfig {
  name: string;
  options?: Options.AssertQueue;
  deadLetter?: boolean;
  bindTo?: {
    exchange: string;
    routingKey?: string;
  };
}

export interface ConsumerOptions {
  retryAttempts?: number;
  retryDelayMs?: number;
}

export type MessageHandler<T = any> = (msg: T) => Promise<void>;

export interface Consumer<T = any> {
  queue: string;
  handler: MessageHandler<T>;
  options?: ConsumerOptions;
}

export interface RabbitMQServiceStatic {
  enabled: boolean;
  config: RabbitMQConfig | null;
  connection: Connection | null;
  channel: Channel | null;
  isInitialized: boolean;
  consumers: Consumer[];
  init(config: RabbitMQConfig): Promise<void>;
  publishToExchange(
    exchange: string,
    routingKey: string,
    message: any
  ): Promise<void>;
  publishToQueue(queue: string, message: any): Promise<void>;
  consume(
    queue: string,
    handler: MessageHandler,
    options?: ConsumerOptions
  ): Promise<void>;
}
