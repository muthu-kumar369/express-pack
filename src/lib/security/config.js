module.exports = {
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
};
