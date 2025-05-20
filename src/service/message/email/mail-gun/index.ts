// src/email/MailGunMailService.ts
import formData from "form-data";
import MailGun from "mailGun.js";
import handlebars from "handlebars";

import {
  MailGunInitConfig,
  MailGunOptions,
  MailGunTemplatedOptions,
} from "../types/mail-gun.types";
import { MailgunMessageData } from "mailGun.js/Types/Messages/Messages";

export class MailGunMailService {
  private static instance: MailGunMailService | null = null;
  private static mgClient: ReturnType<MailGun["client"]>;
  private static domain: string;
  private static defaultFrom: string = "no-reply@example.com";
  private static logger: (message: string, error?: any) => void = console.log;

  private constructor() {}

  public static init(config: MailGunInitConfig): void {
    if (!config.apiKey || !config.domain) {
      throw new Error("MailGun API key and domain are required");
    }

    const mailGun = new MailGun(formData);
    MailGunMailService.mgClient = mailGun.client({
      username: "api",
      key: config.apiKey,
      ...(config?.options || {}),
    });

    MailGunMailService.domain = config.domain;
    MailGunMailService.defaultFrom =
      config.defaultFrom || MailGunMailService.defaultFrom;
    MailGunMailService.logger = config.logger || MailGunMailService.logger;

    if (!MailGunMailService.instance) {
      MailGunMailService.instance = new MailGunMailService();
    }
  }

  public static async sendEmail(options: MailGunOptions): Promise<void> {
    if (!MailGunMailService.instance) {
      throw new Error(
        "MailGunMailService is not initialized. Call init() first."
      );
    }

    const data: MailgunMessageData = {
      from: options.from || MailGunMailService.defaultFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      template: "",
    };

    try {
      await MailGunMailService.mgClient.messages.create(
        MailGunMailService.domain,
        data
      );
      MailGunMailService.logger(`Email sent to ${options.to}`);
    } catch (error) {
      MailGunMailService.logger("Error sending email", error);
      throw error;
    }
  }

  public static async sendTemplatedEmail(
    options: MailGunTemplatedOptions
  ): Promise<void> {
    if (!MailGunMailService.instance) {
      throw new Error(
        "MailGunMailService is not initialized. Call init() first."
      );
    }

    const from = options.from || MailGunMailService.defaultFrom;
    const to = options.to;

    if (options.template) {
      const html = await MailGunMailService.renderLocalTemplate(
        options.template,
        options.dynamicData
      );

      await MailGunMailService.sendEmail({
        to,
        subject: options.subject || "Notification",
        html,
        from,
      });
    } else {
      throw new Error(
        "MailGunMailService requires templateName for templated emails."
      );
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
      MailGunMailService.logger(
        `Error rendering local template: ${template}`,
        err
      );
      throw err;
    }
  }
}
