export interface I18nInitParams {
  config: Record<string, any>;
  locales: Record<string, any>;
}

export interface I18nInterface {
  init(params: I18nInitParams): Promise<void>;
  getMessage(locale: string, key: string): string;
  getConfig(code: string): any;
}
