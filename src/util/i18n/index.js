import i18next from "i18next";

let config = {};
let initialized = false;

export const i18n = {
  async init({ config: configObj, locales }) {
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

  getMessage(locale, key) {
    return i18next.t(key, { lng: locale });
  },

  getConfig(code) {
    return config[code] || {};
  },
};
