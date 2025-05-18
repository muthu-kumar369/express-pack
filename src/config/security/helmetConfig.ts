const config = {
  securityConfig: {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    dnsPrefetchControl: true,
    frameguard: "sameorigin",
    hidePoweredBy: false,
    hsts: { maxAge: 0, includeSubDomains: false, preload: false },
    ieNoOpen: false,
    noSniff: false,
    originAgentCluster: false,
    referrerPolicy: "no-referrer-when-downgrade",
    xssFilter: true,
  },
  getConfig: (config = {}) => {
    return {
      contentSecurityPolicy: config?.contentSecurityPolicy || false,
      crossOriginEmbedderPolicy: config?.crossOriginEmbedderPolicy || false,
      crossOriginOpenerPolicy: config?.crossOriginEmbedderPolicy || false,
      dnsPrefetchControl: config?.dnsPrefetchControl || true,
      frameguard: config?.frameguard || "sameorigin",
      hidePoweredBy: config?.hidePoweredBy || false,
      hsts: config?.hsts || {
        maxAge: 0,
        includeSubDomains: false,
        preload: false,
      },
      ieNoOpen: config?.ieNoOpen || false,
      noSniff: config?.noSniff || false,
      originAgentCluster: config?.originAgentCluster || false,
      referrerPolicy: config?.referrerPolicy || "no-referrer-when-downgrade",
      xssFilter: config?.xssFilter || true,
    };
  },
};

export default config;
