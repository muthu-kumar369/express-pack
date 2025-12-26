// src/types.ts
export interface MailGunInitConfig {
  apiKey: string;
  domain?: string; // required for Mailgun
  defaultFrom?: string;
  options?: any; 
  logger?: (message: string, error?: any) => void;
}

export interface MailGunOptions {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface MailGunTemplatedOptions {
  to: string;
  from?: string;
  subject?: string;
  templateId?: string; // not used in Mailgun
  template?: string;
  dynamicData: Record<string, any>;
}

export interface MailGunMessageData {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}
