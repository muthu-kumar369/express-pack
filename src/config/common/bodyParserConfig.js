const config = {
  config: {
    json: { limit: "100kb" }, // Default JSON body limit
    urlencoded: { extended: true, limit: "100kb" }, // URL-encoded body
    raw: { type: "application/octet-stream", limit: "100kb" }, // Raw body
    text: { type: "text/plain", limit: "100kb" }, // Text body
  },
  getConfig: (config = {}) => {
    return {
      json: config?.json || { limit: "100kb" }, // Default JSON body limit
      urlencoded: config?.urlencoded || { extended: true, limit: "100kb" }, // URL-encoded body
      raw: config?.raw || { type: "application/octet-stream", limit: "100kb" }, // Raw body
      text: config?.text || { type: "text/plain", limit: "100kb" }, // Text body
    };
  },
};

export default config;
