import Stripe from "stripe";
import {
  InitializeConfig,
  WebhookCallback,
  WebhookEventHandler,
} from "../types";

export class StripeService {
  static stripe: Stripe;
  static webhookSecret?: string;
  static webhookHandlers: WebhookEventHandler[] = [];
  static logFn: (...args: any[]) => void = console.log;

  // -----------------------
  // ⚙️ Initialization
  // -----------------------
  static init(secretKey: string, config?: InitializeConfig): void {
    if (!this.stripe) {
      this.stripe = new Stripe(secretKey);

      this.webhookSecret = config?.webhookSecret;
      if (config?.logFn) this.logFn = config.logFn;
      this.log("Stripe initialized");
    } else {
      this.log("Stripe already initialized, skipping.");
    }

    if (config?.webhookEvents) {
      this.registerWebhookEvents({ events: config.webhookEvents });
    }
  }

  // -----------------------
  // 🔔 Webhook Handling
  // -----------------------
  static registerWebhookEvent(event: string, callback: WebhookCallback): void {
    this.webhookHandlers.push({ event, callback });
    this.log(`Registered handler for: ${event}`);
  }

  static registerWebhookEvents({
    events,
  }: {
    events: WebhookEventHandler[];
  }): void {
    this.webhookHandlers.push(...events);
  }

  static clearWebhookHandlers(): void {
    this.webhookHandlers = [];
    this.log("Cleared all webhook handlers");
  }

  static async handleWebhook(
    rawBody: Buffer,
    sigHeader: string
  ): Promise<Stripe.Event> {
    if (!this.webhookSecret || !this.stripe) {
      throw new Error("Stripe or Webhook secret not initialized");
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sigHeader,
        this.webhookSecret
      );
      this.log(`Webhook verified: ${event.type}`);
    } catch (err) {
      this.log("Webhook signature verification failed:", err);
      throw err;
    }

    const handlers = this.webhookHandlers.filter((h) => h.event === event.type);
    for (const handler of handlers) {
      try {
        await handler.callback(event);
      } catch (err) {
        this.log(`Error in handler for ${event.type}:`, err);
      }
    }
    return event;
  }

  // -----------------------
  // 👤 Tenant Customer
  // -----------------------
  static async createTenantCustomer(
    tenantId: string,
    email: string,
    metadata?: Record<string, any>
  ): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      metadata: { tenantId, ...(metadata || {}) },
    });
  }

  static async getTenantCustomer(
    tenantId: string
  ): Promise<Stripe.Customer | null> {
    const customers = await this.stripe.customers.list({ limit: 100 });
    return (
      customers.data.find((c) => c.metadata?.tenantId === tenantId) || null
    );
  }

  static async updateTenantCustomer(
    tenantId: string,
    updateData: Stripe.CustomerUpdateParams
  ): Promise<Stripe.Customer> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.stripe.customers.update(customer.id, updateData);
  }

  static async deleteTenantCustomer(
    tenantId: string
  ): Promise<Stripe.DeletedCustomer> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.stripe.customers.del(customer.id);
  }

  // -----------------------
  // 📦 Subscriptions
  // -----------------------
  static async createTenantSubscription(
    tenantId: string,
    priceId: string,
    metadata?: Record<string, any>
  ): Promise<Stripe.Subscription> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    return await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      metadata: metadata || {},
    });
  }

  static async updateTenantSubscription(
    subscriptionId: string,
    updateFields: Stripe.SubscriptionUpdateParams
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, updateFields);
  }

  static async cancelTenantSubscription(
    subscriptionId: string,
    atPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: atPeriodEnd,
    });
  }

  static async listTenantSubscriptions(
    tenantId: string
  ): Promise<Stripe.Subscription[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const subs = await this.stripe.subscriptions.list({
      customer: customer.id,
    });
    return subs.data;
  }

  // -----------------------
  // 💸 Payments / Invoices
  // -----------------------
  static async createOneTimeCharge(
    tenantId: string,
    amount: number,
    currency: string,
    description: string
  ): Promise<Stripe.PaymentIntent> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    return await this.stripe.paymentIntents.create({
      amount: this.formatAmountToStripeCents(amount),
      currency,
      customer: customer.id,
      description,
      confirm: true,
      payment_method_types: ["card"],
    });
  }

  static async createInvoiceItem(
    tenantId: string,
    amount: number,
    description: string
  ): Promise<Stripe.InvoiceItem> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    return await this.stripe.invoiceItems.create({
      customer: customer.id,
      amount: this.formatAmountToStripeCents(amount),
      currency: "usd",
      description,
    });
  }

  static async createAndSendInvoice(tenantId: string): Promise<Stripe.Invoice> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const invoice: Stripe.Invoice = await this.stripe.invoices.create({
      customer: customer.id,
      auto_advance: true,
    });

    if (!invoice.id) {
      throw new Error("Invoice ID is undefined");
    }

    await this.stripe.invoices.sendInvoice(invoice.id);
    return invoice;
  }

  static async retrieveInvoices(tenantId: string): Promise<Stripe.Invoice[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const invoices = await this.stripe.invoices.list({ customer: customer.id });
    return invoices.data;
  }

  static getInvoiceUrl(invoiceId: string): string {
    return `https://billing.stripe.com/invoices/${invoiceId}`;
  }

  // -----------------------
  // 💳 Payment Methods
  // -----------------------
  static async createPaymentMethod(
    params: Stripe.PaymentMethodCreateParams
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.create(params);
  }

  static async attachPaymentMethodToTenant(
    tenantId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customer.id,
      }
    );

    await this.stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return paymentMethod;
  }

  static async updatePaymentMethod(
    paymentMethodId: string,
    data: Stripe.PaymentMethodUpdateParams
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.update(paymentMethodId, data);
  }

  static async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.detach(paymentMethodId);
  }

  static async listPaymentMethods(
    tenantId: string,
    type: "card" | "nz_bank_account" | "us_bank_account"
  ): Promise<Stripe.PaymentMethod[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customer.id,
      type,
    });
    return paymentMethods.data;
  }

  // -----------------------
  // 📥 Refunds
  // -----------------------
  static async refundCharge(
    chargeId: string,
    amount?: number
  ): Promise<Stripe.Refund> {
    const params: Stripe.RefundCreateParams = { charge: chargeId };
    if (amount) params.amount = this.formatAmountToStripeCents(amount);
    return await this.stripe.refunds.create(params);
  }

  static async getRefunds(tenantId: string): Promise<Stripe.Refund[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const charges = await this.stripe.charges.list({ customer: customer.id });
    return charges.data.flatMap((charge) => charge?.refunds?.data || []);
  }

  // -----------------------
  // 🌐 Billing Portal
  // -----------------------
  static async getBillingPortalSessionUrl(
    tenantId: string,
    returnUrl: string
  ): Promise<string> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    return session.url;
  }

  // -----------------------
  // ⚙️ Helpers
  // -----------------------
  static formatAmountToStripeCents(amount: number): number {
    return Math.round(amount * 100);
  }

  static convertStripeCentsToAmount(cents: number): number {
    return cents / 100;
  }

  static getTenantIdFromMetadata(metadata: object | undefined): string | null {
    return metadata ? (metadata as any).tenantId || null : null;
  }

  static getStripeCustomerIdFromMetadata(
    metadata: object | undefined
  ): string | null {
    return metadata ? (metadata as any).stripeCustomerId || null : null;
  }

  static logStripeError(error: any) {
    this.log("Stripe Error:", error);
  }

  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }
  static log(...args: any[]): void {
    this.logFn?.(...args);
  }
}
