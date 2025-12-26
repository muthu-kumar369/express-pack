import { NodeMailerTransporter } from "../transporter/index.js";
import type {
  EmailTemplate,
  GetTemplateParams,
  SendEmailParams,
  Transporter,
  EmailTemplateName,
} from "../../types/node-mailer.types";

export class NodeMailerService {
  static transporter: Transporter | null = null;
  static defaultFrom: string | undefined = process?.env?.DEFAULT_EMAIL_FROM;

  static init() {
    if (!NodeMailerService.transporter) {
      NodeMailerService.transporter = NodeMailerTransporter.create();
    }
  }

  static async getTemplate({
    templateName,
    templateParams,
  }: GetTemplateParams): Promise<EmailTemplate | undefined> {
    // TODO: Implement email templates
    // return EmailTemplates?.[templateName as EmailTemplateName]?.({
    //   data: templateParams,
    // });
    return undefined;
  }

  static async sendEmail({
    to,
    templateName,
    templateParams = {},
  }: SendEmailParams): Promise<any> {
    if (!NodeMailerService.transporter) {
      throw new Error(
        "NodeMailerService not initialized. Please initialize first."
      );
    }

    const template = await NodeMailerService.getTemplate({
      templateName,
      templateParams,
    });

    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const { subject, html } = template;

    return NodeMailerService.transporter.sendMail({
      from: NodeMailerService.defaultFrom,
      to,
      subject,
      html,
    });
  }
}
