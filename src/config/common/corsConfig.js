const config = {
  corsConfig: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Standard HTTP methods
    allowedHeaders: undefined, // Reflect request's headers
    exposedHeaders: [], // No custom headers exposed by default
    credentials: false, // Disable credentials by default
    maxAge: 86400, // Cache preflight response for 1 day
    preflightContinue: false, // Do not continue the request cycle for preflight
    optionsSuccessStatus: 204, // Standard success status
  },
  getConfig: (config = {}) => {
    return {
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: config?.methods || [
        "GET",
        "HEAD",
        "PUT",
        "PATCH",
        "POST",
        "DELETE",
      ], // Standard HTTP methods
      allowedHeaders: config?.allowedHeaders || undefined, // Reflect request's headers
      exposedHeaders: config?.exposedHeaders || [], // No custom headers exposed by default
      credentials: config?.credentials || false, // Disable credentials by default
      maxAge: config?.maxAge || 86400, // Cache preflight response for 1 day
      preflightContinue: config?.preflightContinue || false, // Do not continue the request cycle for preflight
      optionsSuccessStatus: config?.optionsSuccessStatus || 204, // Standard success status
    };
  },
};

export default config;
