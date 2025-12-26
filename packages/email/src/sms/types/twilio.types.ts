export interface TwilioSMSInitConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  templateDir?: string;
  logger?: (message: string, error?: any) => void;
}

export interface TwilioSMSOptions {
  to: string;
  body: string;
}

export interface TwilioTemplatedSMSOptions {
  to: string;
  template: string;
  dynamicData: Record<string, any>;
}
