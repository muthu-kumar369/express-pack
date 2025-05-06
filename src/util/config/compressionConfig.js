const compression = require("compression");

module.exports = {
  getConfig: (config = {}) => {
    return {
      level: config?.level || 6, // Compression level (0-9) for Gzip
      threshold: config?.threshold || 1024, // Only compress responses larger than 1KB
      filter: config?.filter
        ? config?.filter
        : (req, res) => {
            if (req.headers["x-no-compression"]) {
              return false; // Skip compression if client requests no compression
            }
            return compression.filter(req, res);
          },
    };
  },
};
