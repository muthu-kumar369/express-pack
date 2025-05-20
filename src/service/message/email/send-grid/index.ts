// src/email/SendGridMailService.ts
import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";

import type { MailContent } from "@sendgrid/helpers/classes/mail";
import { EmailInitConfig, EmailOptions, TemplatedEmailOptions } from "../types";

export class SendGridMailService {
  private static instance: SendGridMailService | null = null;
  private static apiKey: string;
  private static defaultFrom: string = "no-reply@example.com";
  private static logger: (message: string, error?: any) => void = console.log;

  private constructor() {}

  public static init(config: EmailInitConfig): void {
    if (!config.apiKey) {
      throw new Error("SendGrid API key is required");
    }

    SendGridMailService.apiKey = config.apiKey;
    sgMail.setApiKey(config.apiKey);
    SendGridMailService.defaultFrom =
      config.defaultFrom || SendGridMailService.defaultFrom;
    SendGridMailService.logger = config.logger || SendGridMailService.logger;

    if (!SendGridMailService.instance) {
      SendGridMailService.instance = new SendGridMailService();
    }
  }

  public static async sendEmail(options: EmailOptions): Promise<void> {
    if (!SendGridMailService.instance) {
      throw new Error(
        "SendGridMailService is not initialized. Call init() first."
      );
    }

    const content: [MailContent] = [
      {
        type: options.html ? "text/html" : "text/plain",
        value: options.html ?? options.text ?? "",
      },
    ];

    const msg = {
      to: options.to,
      from: options.from || SendGridMailService.defaultFrom,
      subject: options.subject,
      content,
    };

    try {
      await sgMail.send(msg);
      SendGridMailService.logger(`Email sent to ${options.to}`);
    } catch (error) {
      SendGridMailService.logger("Error sending email", error);
      throw error;
    }
  }

  public static async sendTemplatedEmail(
    options: TemplatedEmailOptions
  ): Promise<void> {
    if (!SendGridMailService.instance) {
      throw new Error(
        "SendGridMailService is not initialized. Call init() first."
      );
    }

    const from = options.from || SendGridMailService.defaultFrom;
    const to = options.to;

    // Option A: SendGrid dynamic template
    if (options.templateId) {
      const msg = {
        to,
        from,
        templateId: options.templateId,
        dynamic_template_data: options.dynamicData,
      };

      try {
        await sgMail.send(msg);
        SendGridMailService.logger(
          `Templated email sent to ${to} using SendGrid templateId`
        );
        return;
      } catch (error) {
        SendGridMailService.logger(
          "SendGrid dynamic template failed, falling back to local template",
          error
        );
        // Intentionally fall through to local template fallback
      }
    }

    // Option B: Local Handlebars template fallback
    if (options.templateName) {
      const html = await SendGridMailService.renderLocalTemplate(
        options.templateName,
        options.dynamicData
      );
      await SendGridMailService.sendEmail({
        to,
        subject: options.subject || "Notification",
        html,
        from,
      });
    } else {
      throw new Error("Either templateId or templateName must be provided");
    }
  }

  private static async renderLocalTemplate(
    template: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const compiled = handlebars.compile(template);
      return compiled(data);
    } catch (err) {
      SendGridMailService.logger(
        `Error rendering local template: ${template}`,
        err
      );
      throw err;
    }
  }
}

// Example usage:
// SendGridMailService.init({ apiKey: process.env.SENDGRID_API_KEY!, defaultFrom: 'hello@yourdomain.com' });
// await SendGridMailService.sendTemplatedEmail({
//   to: 'user@example.com',
//   templateId: 'd-123456', // Or use templateName: 'welcome'
//   dynamicData: { name: 'John Doe' }
// });
