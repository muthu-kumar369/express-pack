const config = {
  getConfig: (config = {}) => {
    return {
      windowMs: config?.windowMs || 60000, // 1 minute in milliseconds
      limit: config?.limit || 5, // Max requests per minute
      message: config?.message || "Too many requests, please try again later.",
      statusCode: config?.statusCode || 429, // Status code when rate limit is exceeded
      handler: config?.handler || (() => {}), // Optional custom handler function for exceeded limit
      legacyHeaders: config?.legacyHeaders || true, // Enable legacy X-RateLimit-* headers
      standardHeaders: config?.standardHeaders || "draft-6", // Use IETF draft-6 rate-limiting headers
      identifier: config?.identifier || null, // Optional custom identifier for the policy
      store: config?.store || null, // Uses in-memory store by default
      passOnStoreError: config?.passOnStoreError || false, // Do not pass if store fails (defaults to false)
      keyGenerator: config?.keyGenerator || ((req) => req.ip), // Identify users by their IP address
      requestPropertyName: config?.requestPropertyName || "rateLimit", // Store rate limit info in `req.rateLimit`
      skip: config?.skip || (() => false), // Don't skip any requests by default
      skipSuccessfulRequests: config?.skipSuccessfulRequests || false, // Count 1xx/2xx/3xx responses
      skipFailedRequests: config?.skipFailedRequests || false, // Count 4xx/5xx responses
      requestWasSuccessful:
        config?.requestWasSuccessful || ((req, res) => res.statusCode < 400), // Check if request was successful
      validate: config?.validate || true, // Enable config validation
    };
  },
};

export default config;
