import Stripe from "stripe";

// Types (simplified for this file - you can import full types from your central types file)
export type InitializeConfig = {
  webhookSecret?: string;
  logFn?: (...args: any[]) => void;
  defaultCurrency?: string;
  defaultPaymentMethodTypes?: string[];
  retry?: { retries?: number; delayMs?: number };
  stripeOptions?: Stripe.StripeConfig;
  webhookEvents?: WebhookEventHandler[];
  debug?: boolean;
};

export type WebhookCallback = (event: Stripe.Event) => Promise<void> | void;
export type WebhookEventHandler = {
  event: string /* supports wildcard */;
  callback: WebhookCallback;
};

export class StripeService {
  private static _stripe: Stripe | undefined;
  static webhookSecret?: string;
  static webhookHandlers: WebhookEventHandler[] = [];
  static logFn: (...args: any[]) => void = console.info;
  static defaultCurrency = "usd";
  static defaultPaymentMethodTypes: string[] = ["card"];
  static retryConfig = { retries: 3, delayMs: 1000 };
  static debug = false;

  // Expose stripe via getter — throws if not initialized (no null checks everywhere)
  static get stripe(): Stripe {
    if (!this._stripe)
      throw new Error(
        "Stripe has not been initialized. Call StripeService.init() first."
      );
    return this._stripe;
  }

  // -----------------------
  // ⚙️ Initialization
  // -----------------------
  static init(secretKey: string, config?: InitializeConfig): void {
    if (!secretKey)
      throw new Error("Stripe secret key is required for initialization");

    if (!this.stripe) {
      this._stripe = new Stripe(secretKey, config?.stripeOptions || {});
      this.webhookSecret = config?.webhookSecret;
      if (config?.logFn) this.logFn = config.logFn;
      if (config?.defaultCurrency)
        this.defaultCurrency = config.defaultCurrency;
      if (config?.defaultPaymentMethodTypes)
        this.defaultPaymentMethodTypes = config.defaultPaymentMethodTypes;
      if (config?.retry)
        this.retryConfig = { ...this.retryConfig, ...config.retry };
      if (typeof config?.debug === "boolean") this.debug = config.debug;

      this.log("Stripe initialized");
    } else {
      this.log("Stripe already initialized, skipping.");
    }

    if (config?.webhookEvents)
      this.registerWebhookEvents({ events: config.webhookEvents });
  }

  // -----------------------
  // 🔔 Webhook Handling (supports wildcards like invoice.* or *)
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

  static matchEventPattern(pattern: string, actual: string): boolean {
    if (pattern === "*") return true;
    // simple wildcard matching where pattern can include a single '*' to match anything in that segment
    // e.g. 'invoice.*' matches 'invoice.created' or 'invoice.finalized'
    if (pattern.includes("*")) {
      const escaped = pattern
        .split("*")
        .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*");
      const regex = new RegExp(`^${escaped}$`);
      return regex.test(actual);
    }
    return pattern === actual;
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

    const handlers = this.webhookHandlers.filter((h) =>
      this.matchEventPattern(h.event, event.type)
    );

    if (handlers.length === 0) {
      this.log(
        `No handlers registered for ${event.type} - invoked fallback if present`
      );
      // find wildcard fallback '*' if any
      const fallback = this.webhookHandlers.find((h) => h.event === "*");
      if (fallback) {
        try {
          await fallback.callback(event);
        } catch (err) {
          this.log(`Error in fallback handler for ${event.type}:`, err);
        }
      }
    }

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
  // 👤 Tenant Customer (improved search + optional direct ID usage)
  // -----------------------
  static async createTenantCustomer(
    tenantId: string,
    params: Partial<Stripe.CustomerCreateParams> = {}
  ): Promise<Stripe.Customer> {
    const merged: Stripe.CustomerCreateParams = {
      email: params.email,
      metadata: { tenantId, ...(params.metadata || {}) },
      ...params,
    } as Stripe.CustomerCreateParams;

    return await this.execute(() => this.stripe.customers.create(merged));
  }

  static async getTenantCustomer(
    tenantId: string
  ): Promise<Stripe.Customer | null> {
    // Prefer to search by metadata (more efficient and precise)
    try {
      // stripe.customers.search is available in modern Stripe SDKs
      const q = `metadata['tenantId']:'${tenantId.replace(/'/g, "\\'")}'`;
      const res: any = await this.execute(() =>
        (this.stripe.customers as any).search({ query: q, limit: 1 })
      );
      if (res && res.data && res.data.length)
        return res.data[0] as Stripe.Customer;
    } catch (err) {
      // fallback to listing (paginated) - used if search not supported for older SDKs
      this.log(
        "customers.search failed or not supported; falling back to list with pagination",
        err
      );
      let startingAfter: string | undefined = undefined;
      do {
        const list = await this.execute(() =>
          this.stripe.customers.list({
            limit: 100,
            starting_after: startingAfter,
          })
        );
        const found = list.data.find(
          (c) => c.metadata && (c.metadata as any).tenantId === tenantId
        );
        if (found) return found;
        if (!list.has_more) break;
        startingAfter = list.data[list.data.length - 1].id;
      } while (startingAfter);
    }
    return null;
  }

  static async updateTenantCustomer(
    tenantId: string,
    updateData: Stripe.CustomerUpdateParams
  ): Promise<Stripe.Customer> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.execute(() =>
      this.stripe.customers.update(customer.id, updateData)
    );
  }

  static async deleteTenantCustomer(
    tenantId: string
  ): Promise<Stripe.DeletedCustomer> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.execute(() => this.stripe.customers.del(customer.id));
  }

  // -----------------------
  // 📦 Subscriptions (flexible params + idempotency)
  // -----------------------
  static async createTenantSubscription(
    tenantId: string,
    params: Partial<Stripe.SubscriptionCreateParams> & {
      idempotencyKey?: string;
      priceId?: string;
    } = {}
  ): Promise<Stripe.Subscription> {
    const customer: any = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    // Destructure to remove idempotencyKey before passing to Stripe
    const { idempotencyKey, priceId, ...rest } = params;

    const base: Stripe.SubscriptionCreateParams = {
      ...rest, // spread first
      customer: customer.id, // then enforce correct customer
      items: rest.items || (priceId ? [{ price: priceId }] : undefined),
      metadata: rest.metadata || {},
    };

    const options: Stripe.RequestOptions = {};
    if (idempotencyKey) options.idempotencyKey = idempotencyKey;

    return await this.execute(() =>
      this.stripe.subscriptions.create(base, options)
    );
  }

  static async updateTenantSubscription(
    subscriptionId: string,
    updateFields: Stripe.SubscriptionUpdateParams,
    idempotencyKey?: string
  ): Promise<Stripe.Subscription> {
    return await this.execute(() =>
      this.stripe.subscriptions.update(
        subscriptionId,
        updateFields,
        idempotencyKey ? { idempotencyKey } : undefined
      )
    );
  }

  static async cancelTenantSubscription(
    subscriptionId: string,
    options: { atPeriodEnd?: boolean; invoiceNow?: boolean } = {
      atPeriodEnd: true,
    }
  ): Promise<Stripe.Subscription> {
    // allow both cancel_at_period_end or immediate cancel
    if (options.atPeriodEnd) {
      return await this.updateTenantSubscription(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
    return await this.execute(() =>
      this.stripe.subscriptions.cancel(subscriptionId)
    );
  }

  static async listTenantSubscriptions(
    tenantId: string
  ): Promise<Stripe.Subscription[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const subs = await this.execute(() =>
      this.stripe.subscriptions.list({ customer: customer.id })
    );
    return subs.data;
  }

  // -----------------------
  // 💸 Payments / Invoices (fully param-driven)
  // -----------------------
  static async createOneTimeCharge(
    tenantId: string,
    params: Partial<Stripe.PaymentIntentCreateParams> & {
      amount?: number;
      idempotencyKey?: string;
    }
  ): Promise<Stripe.PaymentIntent> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    if (params.amount !== undefined)
      params.amount = this.formatAmountToStripeCents(params.amount);

    const toSend: Stripe.PaymentIntentCreateParams = {
      customer: customer.id,
      currency: (params.currency ||
        this.defaultCurrency) as Stripe.PaymentIntentCreateParams["currency"],
      payment_method_types:
        params.payment_method_types || this.defaultPaymentMethodTypes,
      ...params,
    } as Stripe.PaymentIntentCreateParams;

    const options: Stripe.RequestOptions = {};
    if ((params as any).idempotencyKey)
      options.idempotencyKey = (params as any).idempotencyKey;

    return await this.execute(() =>
      this.stripe.paymentIntents.create(toSend, options)
    );
  }

  static async createInvoiceItem(
    tenantId: string,
    params: Partial<Stripe.InvoiceItemCreateParams> & {
      amount?: number;
      currency?: string;
    }
  ): Promise<Stripe.InvoiceItem> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    if (params.amount !== undefined)
      params.amount = this.formatAmountToStripeCents(params.amount);

    const toSend: Stripe.InvoiceItemCreateParams = {
      customer: customer.id,
      currency: params.currency || this.defaultCurrency,
      ...params,
    } as Stripe.InvoiceItemCreateParams;

    return await this.execute(() => this.stripe.invoiceItems.create(toSend));
  }

  static async createAndSendInvoice(
    tenantId: string,
    params: Partial<Stripe.InvoiceCreateParams> = {}
  ): Promise<Stripe.Invoice> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const invoice: any = await this.execute(() =>
      this.stripe.invoices.create({
        customer: customer.id,
        auto_advance: true,
        ...params,
      } as Stripe.InvoiceCreateParams)
    );

    if (!invoice.id) throw new Error("Invoice ID is undefined");
    await this.execute(() => this.stripe.invoices.sendInvoice(invoice.id));
    return invoice;
  }

  static async retrieveInvoices(tenantId: string): Promise<Stripe.Invoice[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const invoices = await this.execute(() =>
      this.stripe.invoices.list({ customer: customer.id })
    );
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
    return await this.execute(() => this.stripe.paymentMethods.create(params));
  }

  static async attachPaymentMethodToTenant(
    tenantId: string,
    paymentMethodId: string,
    options: { setAsDefault?: boolean } = { setAsDefault: true }
  ): Promise<Stripe.PaymentMethod> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const paymentMethod = await this.execute(() =>
      this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      } as any)
    );

    if (options.setAsDefault) {
      await this.execute(() =>
        this.stripe.customers.update(customer.id, {
          invoice_settings: { default_payment_method: paymentMethodId },
        })
      );
    }

    return paymentMethod;
  }

  static async updatePaymentMethod(
    paymentMethodId: string,
    data: Stripe.PaymentMethodUpdateParams
  ): Promise<Stripe.PaymentMethod> {
    return await this.execute(() =>
      this.stripe.paymentMethods.update(paymentMethodId, data)
    );
  }

  static async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    return await this.execute(() =>
      this.stripe.paymentMethods.detach(paymentMethodId)
    );
  }

  static async listPaymentMethods(
    tenantId: string,
    type: string = "card"
  ): Promise<Stripe.PaymentMethod[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];

    const paymentMethods = await this.execute(() =>
      this.stripe.paymentMethods.list({ customer: customer.id, type } as any)
    );
    return paymentMethods.data;
  }

  // -----------------------
  // 📥 Refunds
  // -----------------------
  static async refundCharge(
    chargeId: string,
    amount?: number,
    idempotencyKey?: string
  ): Promise<Stripe.Refund> {
    const params: Stripe.RefundCreateParams = { charge: chargeId } as any;
    if (amount !== undefined)
      params.amount = this.formatAmountToStripeCents(amount);
    const options: Stripe.RequestOptions = {};
    if (idempotencyKey) options.idempotencyKey = idempotencyKey;
    return await this.execute(() =>
      this.stripe.refunds.create(params, options)
    );
  }

  static async getRefunds(tenantId: string): Promise<Stripe.Refund[]> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const charges = await this.execute(() =>
      this.stripe.charges.list({ customer: customer.id })
    );
    return charges.data.flatMap((charge) => charge?.refunds?.data || []);
  }

  // -----------------------
  // 🌐 Billing Portal
  // -----------------------
  static async getBillingPortalSessionUrl(
    tenantId: string,
    returnUrl: string,
    params?: Partial<Stripe.BillingPortal.SessionCreateParams>
  ): Promise<string> {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");

    const session = await this.execute(() =>
      this.stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: returnUrl,
        ...params,
      } as Stripe.BillingPortal.SessionCreateParams)
    );

    return session.url!;
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
    this.log("Stripe Error:", this.parseStripeError(error));
  }

  static parseStripeError(error: any): string {
    if (!error) return "Unknown Stripe error";
    if (error.type && error.message) return `[${error.type}] ${error.message}`;
    if (error.raw && error.raw.message) return error.raw.message;
    return String(error);
  }

  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = this.retryConfig.retries,
    delay = this.retryConfig.delayMs
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      if (this.debug)
        this.log("retryWithBackoff: attempt failed, retrying", {
          retries,
          err,
        });
      await new Promise((res) => setTimeout(res, delay));
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }

  private static async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await this.retryWithBackoff(
        fn,
        this.retryConfig.retries,
        this.retryConfig.delayMs
      );
    } catch (err) {
      this.logStripeError(err);
      throw err;
    }
  }

  // Convenience composite helper
  static async createCustomerAndSubscription(
    tenantId: string,
    customerParams: Partial<Stripe.CustomerCreateParams>,
    subscriptionParams: Partial<Stripe.SubscriptionCreateParams> & {
      idempotencyKey?: string;
    }
  ) {
    const customer = await this.createTenantCustomer(tenantId, customerParams);
    const sub = await this.createTenantSubscription(tenantId, {
      ...subscriptionParams,
      customer: customer.id,
    });
    return { customer, subscription: sub };
  }

  static log(...args: any[]): void {
    try {
      this.logFn?.(...args);
    } catch (err) {
      // swallow logging errors
      console.info(...args);
    }
  }
}
