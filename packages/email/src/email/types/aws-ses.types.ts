export interface SESEmailInitConfig {
  apiKey: string;
  secretKey?: string; // Needed for AWS SES
  region?: string; // Needed for AWS SES
  defaultFrom?: string;
  logger?: (message: string, error?: any) => void;
}

export interface SESEmailOptions {
  to: string;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface SESTemplatedEmailOptions extends SESEmailOptions {
  templateId?: string; // SES template name
  templateName?: string; // Fallback local template (handlebars string)
  dynamicData?: object;
}
