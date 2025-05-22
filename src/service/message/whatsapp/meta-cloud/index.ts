import axios from "axios";
import handlebars from "handlebars";

import type {
  MetaCloudWhatsappInitConfig,
  MetaCloudWhatsappOptions,
  MetaCloudWhatsappTemplatedOptions,
} from "../types";

export class WhatsappService {
  private static instance: WhatsappService | null = null;
  private static accessToken: string;
  private static phoneNumberId: string;
  private static apiVersion: string = "v19.0";
  private static logger: (message: string, error?: any) => void = console.log;

  private constructor() {}

  public static init(config: MetaCloudWhatsappInitConfig): void {
    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error("Access Token and Phone Number ID are required");
    }

    WhatsappService.accessToken = config.accessToken;
    WhatsappService.phoneNumberId = config.phoneNumberId;
    WhatsappService.apiVersion =
      config.apiVersion || WhatsappService.apiVersion;
    WhatsappService.logger = config.logger || WhatsappService.logger;

    if (!WhatsappService.instance) {
      WhatsappService.instance = new WhatsappService();
    }
  }

  public static async sendMessage(
    options: MetaCloudWhatsappOptions
  ): Promise<void> {
    if (!WhatsappService.instance) {
      throw new Error("WhatsappService is not initialized. Call init() first.");
    }

    const url = `https://graph.facebook.com/${WhatsappService.apiVersion}/${WhatsappService.phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: options.to,
      type: "text",
      text: { body: options.text },
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${WhatsappService.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      WhatsappService.logger(`WhatsApp message sent to ${options.to}`);
    } catch (error) {
      WhatsappService.logger("Error sending WhatsApp message", error);
      throw error;
    }
  }

  public static async sendTemplatedMessage(
    options: MetaCloudWhatsappTemplatedOptions
  ): Promise<void> {
    if (!WhatsappService.instance) {
      throw new Error("WhatsappService is not initialized. Call init() first.");
    }

    const url = `https://graph.facebook.com/${WhatsappService.apiVersion}/${WhatsappService.phoneNumberId}/messages`;

    // Option A: Use Meta WhatsApp template
    if (options.templateName) {
      const payload = {
        messaging_product: "whatsapp",
        to: options.to,
        type: "template",
        template: {
          name: options.templateName,
          language: {
            code: options.languageCode || "en_US",
          },
          components: options.components || [],
        },
      };

      try {
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${WhatsappService.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        WhatsappService.logger(
          `Templated WhatsApp message sent to ${options.to}`
        );
        return;
      } catch (error) {
        WhatsappService.logger(
          "WhatsApp template message failed, falling back",
          error
        );
        // Intentionally fall through to local template fallback
      }
    }

    // Option B: Local template fallback using handlebars
    if (options.localTemplate && options.variables) {
      const text = await WhatsappService.renderLocalTemplate(
        options.localTemplate,
        options.variables
      );
      await WhatsappService.sendMessage({ to: options.to, text });
    } else {
      throw new Error("Either templateName or localTemplate must be provided");
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
      WhatsappService.logger(`Error rendering local template`, err);
      throw err;
    }
  }
}
