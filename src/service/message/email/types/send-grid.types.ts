export interface EmailInitConfig {
  apiKey: string;
  defaultFrom?: string;
  logger?: (message: string, error?: any) => void;
  templateDir?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface TemplatedEmailOptions {
  to: string;
  subject?: string;
  templateId?: string; // SendGrid dynamic template
  templateName?: string; // Local handlebars template
  dynamicData: Record<string, any>;
  from?: string;
}
