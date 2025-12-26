export interface MetaCloudWhatsappInitConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion?: string;
  logger?: (message: string, error?: any) => void;
}

export interface MetaCloudWhatsappOptions {
  to: string; // phone number in international format
  text: string;
}

export interface MetaCloudWhatsappTemplatedOptions {
  to: string;
  templateName?: string; // Meta template name
  languageCode?: string; // e.g., "en_US"
  components?: Array<any>; // Template variables formatted for Meta API
  localTemplate?: string; // Local handlebars template
  variables?: Record<string, any>; // Local template data
}
