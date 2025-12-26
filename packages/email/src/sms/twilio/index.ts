import twilio, { Twilio } from "twilio";
import handlebars from "handlebars";
import {
  TwilioSMSInitConfig,
  TwilioSMSOptions,
  TwilioTemplatedSMSOptions,
} from "../types";

export class SMSService {
  private static instance: SMSService | null = null;
  private static client: Twilio;
  private static fromNumber: string = "";
  private static logger: (message: string, error?: any) => void = console.log;

  private constructor() {}

  public static init(config: TwilioSMSInitConfig): void {
    if (!config.accountSid || !config.authToken || !config.fromNumber) {
      throw new Error(
        "Twilio accountSid, authToken, and fromNumber are required"
      );
    }

    SMSService.client = twilio(config.accountSid, config.authToken);
    SMSService.fromNumber = config.fromNumber;
    SMSService.logger = config.logger || SMSService.logger;

    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
  }

  public static async sendSMS(options: TwilioSMSOptions): Promise<void> {
    if (!SMSService.instance) {
      throw new Error("SMSService is not initialized. Call init() first.");
    }

    try {
      await SMSService.client.messages.create({
        to: options.to,
        from: SMSService.fromNumber,
        body: options.body,
      });

      SMSService.logger(`SMS sent to ${options.to}`);
    } catch (error) {
      SMSService.logger("Error sending SMS", error);
      throw error;
    }
  }

  public static async sendTemplatedSMS(
    options: TwilioTemplatedSMSOptions
  ): Promise<void> {
    if (!SMSService.instance) {
      throw new Error("SMSService is not initialized. Call init() first.");
    }

    if (!options.template) {
      throw new Error("Template name is required for templated SMS.");
    }

    const renderedBody = await SMSService.renderTemplate(
      options.template,
      options.dynamicData
    );

    await SMSService.sendSMS({
      to: options.to,
      body: renderedBody,
    });
  }

  private static async renderTemplate(
    template: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const compiled = handlebars.compile(template);
      return compiled(data);
    } catch (err) {
      SMSService.logger(`Error rendering SMS template: ${template}`, err);
      throw err;
    }
  }
}
