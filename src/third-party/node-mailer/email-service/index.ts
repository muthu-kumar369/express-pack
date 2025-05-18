import EmailTransporter from "../transporter/index.js";
import EmailTemplates from "../../../config/email-template/index.js";
import type {
  EmailTemplate,
  GetTemplateParams,
  SendEmailParams,
  Transporter,
  EmailTemplateName,
} from "../../types";

export class EmailService {
  static transporter: Transporter | null = null;
  static defaultFrom: string | undefined = process?.env?.DEFAULT_EMAIL_FROM;

  static init() {
    if (!EmailService.transporter) {
      EmailService.transporter = EmailTransporter.create();
    }
  }

  static async getTemplate({
    templateName,
    templateParams,
  }: GetTemplateParams): Promise<EmailTemplate | undefined> {
    return EmailTemplates?.[templateName as EmailTemplateName]?.({
      data: templateParams,
    });
  }

  static async sendEmail({
    to,
    templateName,
    templateParams = {},
  }: SendEmailParams): Promise<any> {
    if (!EmailService.transporter) {
      throw new Error("EmailService not initialized. Please initialize first.");
    }

    const template = await EmailService.getTemplate({
      templateName,
      templateParams,
    });

    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const { subject, html } = template;

    return EmailService.transporter.sendMail({
      from: EmailService.defaultFrom,
      to,
      subject,
      html,
    });
  }
}
