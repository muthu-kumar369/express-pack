// emailService.types.ts

export interface EmailTemplateParams {
  [key: string]: any;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface GetTemplateParams {
  templateName: string;
  templateParams: EmailTemplateParams;
}

export interface SendEmailParams {
  to: string;
  templateName: string;
  templateParams?: EmailTemplateParams;
}

export interface Transporter {
  sendMail: (options: {
    from: string | undefined;
    to: string;
    subject: string;
    html: string;
  }) => Promise<any>;
}

export type EmailTemplateName = "welcome" | "resetPassword" | "orderConfirmed";
