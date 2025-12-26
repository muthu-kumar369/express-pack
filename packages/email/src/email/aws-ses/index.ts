import {
  SESClient,
  SendEmailCommand,
  SendTemplatedEmailCommand,
} from "@aws-sdk/client-ses";
import handlebars from "handlebars";

import {
  SESEmailInitConfig,
  SESEmailOptions,
  SESTemplatedEmailOptions,
} from "../types";

export class SESMailService {
  private static instance: SESMailService | null = null;
  private static client: SESClient;
  private static defaultFrom: string = "no-reply@example.com";
  private static logger: (message: string, error?: any) => void = console.log;

  private constructor() {}

  public static init(config: SESEmailInitConfig): void {
    if (!config.apiKey || !config.region) {
      throw new Error("AWS credentials and region are required");
    }

    SESMailService.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.apiKey,
        secretAccessKey: config.secretKey!,
      },
    });

    SESMailService.defaultFrom =
      config.defaultFrom || SESMailService.defaultFrom;
    SESMailService.logger = config.logger || SESMailService.logger;

    if (!SESMailService.instance) {
      SESMailService.instance = new SESMailService();
    }
  }

  public static async sendEmail(options: SESEmailOptions): Promise<void> {
    if (!SESMailService.instance) {
      throw new Error("SESMailService is not initialized. Call init() first.");
    }

    const params = {
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Body: {
          Html: options.html
            ? { Charset: "UTF-8", Data: options.html }
            : undefined,
          Text: options.text
            ? { Charset: "UTF-8", Data: options.text }
            : undefined,
        },
        Subject: {
          Charset: "UTF-8",
          Data: options.subject,
        },
      },
      Source: options.from || SESMailService.defaultFrom,
    };

    try {
      await SESMailService.client.send(new SendEmailCommand(params));
      SESMailService.logger(`Email sent to ${options.to}`);
    } catch (error) {
      SESMailService.logger("Error sending email via SES", error);
      throw error;
    }
  }

  public static async sendTemplatedEmail(
    options: SESTemplatedEmailOptions
  ): Promise<void> {
    if (!SESMailService.instance) {
      throw new Error("SESMailService is not initialized. Call init() first.");
    }

    const from = options.from || SESMailService.defaultFrom;
    const to = options.to;

    // Option A: AWS SES Template
    if (options.templateId) {
      const params = {
        Destination: {
          ToAddresses: [to],
        },
        Template: options.templateId,
        TemplateData: JSON.stringify(options.dynamicData || {}),
        Source: from,
      };

      try {
        await SESMailService.client.send(new SendTemplatedEmailCommand(params));
        SESMailService.logger(
          `Templated email sent to ${to} using SES templateId`
        );
        return;
      } catch (error) {
        SESMailService.logger(
          "SES template failed, falling back to local template",
          error
        );
      }
    }

    // Option B: Local Handlebars template fallback
    if (options.templateName) {
      const html = await SESMailService.renderLocalTemplate(
        options.templateName,
        options.dynamicData || {}
      );
      await SESMailService.sendEmail({
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
    data: object
  ): Promise<string> {
    try {
      const compiled = handlebars.compile(template);
      return compiled(data);
    } catch (err) {
      SESMailService.logger(`Error rendering local template: ${template}`, err);
      throw err;
    }
  }
}
