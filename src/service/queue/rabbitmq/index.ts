import * as amqplib from "amqplib";
import type { Channel, Connection } from "amqplib";
import type {
  RabbitMQConfig,
  Consumer,
  ConsumerOptions,
  MessageHandler,
} from "../../../third-party/types";

export class RabbitMQService {
  static enabled: boolean = false;
  static config: RabbitMQConfig | null = null;
  static connection: amqplib.ChannelModel | null = null;
  static channel: Channel | null = null;
  static isInitialized: boolean = false;
  static consumers: Consumer[] = [];

  static async init(config: RabbitMQConfig) {
    if (RabbitMQService.isInitialized || !config?.enabled) return;

    console.log("I am trying to initialize the RabbitMQService");
    RabbitMQService.enabled = true;
    RabbitMQService.config = config;
    RabbitMQService.isInitialized = true;
    await RabbitMQService.#connect();
  }

  static async #connect() {
    try {
      if (!RabbitMQService.config) throw new Error("Config not set");

      RabbitMQService.connection = await amqplib.connect(
        RabbitMQService.config.uri
      );

      RabbitMQService.connection?.on("error", (err) => {
        console.error("[RabbitMQService] Connection error event:", err);
        RabbitMQService.#reconnect();
      });

      RabbitMQService.connection?.on("close", () => {
        console.warn("[RabbitMQService] Connection closed, reconnecting...");
        RabbitMQService.#reconnect();
      });

      RabbitMQService.channel =
        await RabbitMQService.connection?.createChannel();

      if (RabbitMQService.config.prefetch && RabbitMQService.channel) {
        RabbitMQService.channel.prefetch(RabbitMQService.config.prefetch);
      }

      await RabbitMQService.#setupExchanges();
      await RabbitMQService.#setupQueues();
      await RabbitMQService.#reRegisterConsumers();

      console.log("[RabbitMQService] Connected and configured.");
    } catch (err) {
      console.error("[RabbitMQService] Connection error:", err);
      RabbitMQService.#reconnect();
    }
  }

  static async #reconnect() {
    console.warn("[RabbitMQService] Reconnecting in 5s...");
    setTimeout(() => RabbitMQService.#connect(), 5000);
  }

  static async #setupExchanges() {
    if (!RabbitMQService.config?.exchanges || !RabbitMQService.channel) return;

    for (const ex of RabbitMQService.config.exchanges) {
      await RabbitMQService.channel.assertExchange(
        ex.name,
        ex.type,
        ex.options || {}
      );
    }
  }

  static async #setupQueues() {
    if (!RabbitMQService.config?.queues || !RabbitMQService.channel) return;

    for (const q of RabbitMQService.config.queues) {
      const options = q.options || {};

      if (q.deadLetter) {
        await RabbitMQService.channel.assertExchange(
          `${q.name}.dlx`,
          "fanout",
          { durable: true }
        );
        await RabbitMQService.channel.assertQueue(`${q.name}.dlq`, {
          durable: true,
        });
        await RabbitMQService.channel.bindQueue(
          `${q.name}.dlq`,
          `${q.name}.dlx`,
          ""
        );

        options.deadLetterExchange = `${q.name}.dlx`;
      }

      await RabbitMQService.channel.assertQueue(q.name, options);

      if (q.bindTo) {
        await RabbitMQService.channel.bindQueue(
          q.name,
          q.bindTo.exchange,
          q.bindTo.routingKey || ""
        );
      }
    }
  }

  static getChannel(): Channel {
    if (!RabbitMQService.channel)
      throw new Error("RabbitMQService not initialized");
    return RabbitMQService.channel;
  }

  static async publishToExchange(
    exchange: string,
    routingKey: string,
    message: any
  ) {
    if (!RabbitMQService.channel)
      throw new Error("RabbitMQService not connected");
    const buffer = Buffer.from(JSON.stringify(message));
    RabbitMQService.channel.publish(exchange, routingKey, buffer, {
      persistent: true,
    });
  }

  static async publishToQueue(queue: string, message: any) {
    if (!RabbitMQService.channel)
      throw new Error("RabbitMQService not connected");
    const buffer = Buffer.from(JSON.stringify(message));
    RabbitMQService.channel.sendToQueue(queue, buffer, { persistent: true });
  }

  static async consume(
    queue: string,
    handler: MessageHandler,
    options: ConsumerOptions = {}
  ) {
    RabbitMQService.consumers.push({ queue, handler, options });
    if (!RabbitMQService.channel) {
      console.warn(
        `[RabbitMQService] Consumer for "${queue}" registered before initialization. Will activate after connection.`
      );
      return;
    }

    await RabbitMQService.#setupConsumer(queue, handler, options);
  }

  static async #setupConsumer(
    queue: string,
    handler: MessageHandler,
    options: ConsumerOptions = {}
  ) {
    const retryLimit = options.retryAttempts ?? 3;
    const retryDelay = options.retryDelayMs ?? 1000;
    const channel = RabbitMQService.getChannel();

    await channel.consume(queue, async (msg) => {
      if (!msg) return;

      const content = JSON.parse(msg.content.toString());
      let attempts = 0;

      const attempt = async () => {
        try {
          await handler(content);
          channel.ack(msg);
        } catch (err) {
          attempts++;
          if (attempts <= retryLimit) {
            console.warn(
              `[RabbitMQService] Retry attempt ${attempts} for queue "${queue}"`
            );
            setTimeout(attempt, retryDelay);
          } else {
            console.error(
              `[RabbitMQService] Failed after ${retryLimit} attempts for queue "${queue}"`,
              err
            );
            channel.nack(msg, false, false); // DLQ fallback
          }
        }
      };

      attempt();
    });
  }

  static async #reRegisterConsumers() {
    if (!RabbitMQService.consumers.length) return;

    console.log("[RabbitMQService] Re-registering consumers...");
    for (const { queue, handler, options } of RabbitMQService.consumers) {
      try {
        await RabbitMQService.#setupConsumer(queue, handler, options);
      } catch (err) {
        console.error(
          `[RabbitMQService] Error re-registering consumer for queue "${queue}"`,
          err
        );
      }
    }
  }
}
