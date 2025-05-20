import Stripe from "stripe";

export type WebhookCallback = (event: Stripe.Event) => Promise<void> | void;

export interface WebhookEventHandler {
  event: string;
  callback: WebhookCallback;
}

export interface InitializeConfig {
  apiVersion?: string;
  webhookSecret?: string;
  webhookEvents?: WebhookEventHandler[];
  logFn?: (...args: any[]) => void;
}
