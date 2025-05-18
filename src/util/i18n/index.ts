import i18next from "i18next";
import type { I18nInitParams, I18nInterface } from "../types";

let config: Record<string, any> = {};
let initialized = false;

export const i18n: I18nInterface = {
  async init({ config: configObj, locales }: I18nInitParams): Promise<void> {
    if (initialized) return;

    config = configObj;

    await i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources: locales,
      interpolation: { escapeValue: false },
    });

    initialized = true;
  },

  getMessage(locale: string, key: string): string {
    return i18next.t(key, { lng: locale });
  },

  getConfig(code: string): any {
    return config[code] || {};
  },
};
