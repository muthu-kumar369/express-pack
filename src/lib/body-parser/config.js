module.exports = {
  config: {
    json: { limit: "100kb" }, // Default JSON body limit
    urlencoded: { extended: true, limit: "100kb" }, // URL-encoded body
    raw: { type: "application/octet-stream", limit: "100kb" }, // Raw body
    text: { type: "text/plain", limit: "100kb" }, // Text body
  },
};
