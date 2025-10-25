"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AsyncRouteWrapper: () => AsyncRouteWrapper,
  AuthMiddleware: () => AuthMiddleware,
  AxiosHelper: () => AxiosHelper,
  BodyParser: () => BodyParser,
  CompressionHandler: () => CompressionHandler,
  Cors: () => Cors,
  CronManager: () => CronManager,
  DateUtilBusiness: () => DateUtilBusiness,
  DateUtilCompare: () => DateUtilCompare,
  DateUtilCreate: () => DateUtilCreate,
  DateUtilDuration: () => DateUtilDuration,
  DateUtilEdgeCase: () => DateUtilEdgeCase,
  DateUtilFormat: () => DateUtilFormat,
  DateUtilManipulate: () => DateUtilManipulate,
  DateUtilTimezone: () => DateUtilTimezone,
  DateUtilValidate: () => DateUtilValidate,
  DateUtilsRange: () => DateUtilsRange,
  DotEnv: () => DotEnv,
  EncryptionUtil: () => EncryptionUtil,
  ErrorHandler: () => ErrorHandler,
  ExpressPack: () => ExpressPack,
  JWTUtil: () => JWTUtil,
  LodashHelper: () => LodashHelper,
  LoggerHandler: () => LoggerHandler,
  ModelBuilder: () => ModelBuilder,
  Mongoose: () => Mongoose,
  MongooseCorePlugin: () => MongooseCorePlugin,
  MongoosePerformancePlugin: () => MongoosePerformancePlugin,
  MongoosePopulatePlugin: () => MongoosePopulatePlugin,
  MongooseSecurityPlugin: () => MongooseSecurityPlugin,
  NodeMailerService: () => NodeMailerService,
  PassportService: () => PassportService,
  RabbitMQService: () => RabbitMQService,
  RateLimitHandler: () => RateLimitHandler,
  RedisClientService: () => RedisClientService,
  RequestTracer: () => RequestTracer,
  RequestValidator: () => RequestValidator,
  ResponseUtil: () => ResponseUtil,
  S3Service: () => S3Service,
  SMSService: () => SMSService,
  SecurityHandler: () => SecurityHandler,
  StripeService: () => StripeService,
  TokenBlacklistedError: () => TokenBlacklistedError,
  TokenExpiredError: () => TokenExpiredError,
  TokenInvalidError: () => TokenInvalidError,
  availablePlugins: () => availablePlugins,
  i18n: () => i18n,
  logger: () => logger,
  z: () => z2
});
module.exports = __toCommonJS(index_exports);

// src/auth/util/jwt/index.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/common/error/token-error/index.ts
var TokenExpiredError = class extends Error {
  constructor(message = "Token has expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
};
var TokenInvalidError = class extends Error {
  constructor(message = "Token is invalid") {
    super(message);
    this.name = "TokenInvalidError";
  }
};
var TokenBlacklistedError = class extends Error {
  constructor(message = "Token has been blacklisted") {
    super(message);
    this.name = "TokenBlacklistedError";
  }
};

// src/auth/util/jwt/index.ts
var JWTUtil = class {
  static async generateTokens({
    tokenPayload,
    refreshTokenPayload = {},
    generateRefreshToken = false
  }) {
    if (!tokenPayload) {
      throw new Error("Token payload is needed to generate the token");
    }
    const secret = tokenPayload.JWT_SECRET || process?.env?.JWT_SECRET || "";
    if (!secret) {
      throw new Error("JWT secret is required");
    }
    const expiresIn = tokenPayload.expiresIn ? tokenPayload.expiresIn : void 0;
    const signOptions = {};
    if (expiresIn) {
      signOptions.expiresIn = process?.env?.ACCESS_TOKEN_EXPIRE_TIME || "25m";
    }
    if (generateRefreshToken) {
      return {
        accessToken: import_jsonwebtoken.default.sign(tokenPayload.payload || {}, secret, signOptions),
        refreshToken: await this.generateRefreshToken({
          payload: tokenPayload.payload,
          ...refreshTokenPayload
        })
      };
    } else {
      const { payload } = tokenPayload;
      return import_jsonwebtoken.default.sign(payload || {}, secret, signOptions);
    }
  }
  static async generateRefreshToken({
    payload,
    REFRESH_SECRET = process?.env?.REFRESH_SECRET || "",
    expiresIn = "7d"
  }) {
    if (!payload) {
      throw new Error("Token payload is needed to generate the token");
    }
    if (!REFRESH_SECRET) {
      throw new Error("Refresh secret is required");
    }
    const signOptions = {};
    if (!expiresIn) {
      signOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRE_TOKEN || "7d";
    }
    return import_jsonwebtoken.default.sign(payload, REFRESH_SECRET, signOptions);
  }
  static async verify({ token, JWT_SECRET = "" }) {
    try {
      const secret = JWT_SECRET || process?.env?.JWT_SECRET || "";
      if (!secret) throw new Error("JWT secret is required for verification");
      return import_jsonwebtoken.default.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw new TokenExpiredError();
      if (err.name === "JsonWebTokenError") throw new TokenInvalidError();
      throw err;
    }
  }
  static decode({ token }) {
    return import_jsonwebtoken.default.decode(token);
  }
  static async verifyRefreshToken({
    token,
    REFRESH_SECRET = process?.env?.REFRESH_SECRET || ""
  }) {
    try {
      if (!REFRESH_SECRET) {
        throw new Error("Refresh secret is required for verification");
      }
      const payload = import_jsonwebtoken.default.verify(token, REFRESH_SECRET);
      return payload;
    } catch {
      throw new TokenInvalidError("Refresh token is invalid");
    }
  }
  static async refreshAccessToken({
    token,
    REFRESH_SECRET,
    JWT_SECRET
  }) {
    const payload = await this.verifyRefreshToken({ token, REFRESH_SECRET });
    if (payload) {
      return this.generateTokens({
        tokenPayload: {
          payload,
          JWT_SECRET,
          expiresIn: process?.env?.ACCESS_TOKEN_EXPIRE_TIME || "25m"
        }
      });
    }
    return null;
  }
};

// src/auth/util/passport/index.ts
var import_passport = __toESM(require("passport"), 1);
var PassportService = class {
  /**
   * Initialize passport with strategies, serialization and deserialization
   */
  static init(config8) {
    if (this.initialized) return;
    for (const { name, strategy } of config8.strategies) {
      import_passport.default.use(name, strategy);
    }
    import_passport.default.serializeUser(
      config8.serializeUser ?? ((user, done) => done(null, user.id))
    );
    import_passport.default.deserializeUser(
      config8.deserializeUser ?? ((id, done) => done(null, { id }))
      // Default dummy, should be overridden
    );
    this.initialized = true;
  }
  /**
   * Returns the passport middleware to be plugged into Express
   */
  static initialize({ app }) {
    app.use(import_passport.default.initialize());
  }
  /**
   * Returns the passport session middleware (optional)
   */
  static session({ app }) {
    app.use(import_passport.default.session());
  }
};
PassportService.initialized = false;

// src/auth/middleware/index.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_passport2 = __toESM(require("passport"), 1);
var AuthMiddleware = class {
  static authenticateJWT({
    userAuth = {},
    roleAuth = {},
    scopeAuth = {}
  }) {
    if (userAuth && Object.keys(userAuth).length) {
      return this.authenticateUser(userAuth);
    }
    if (roleAuth && Object.keys(roleAuth).length) {
      return this.authorizeRole(roleAuth);
    }
    if (scopeAuth && Object.keys(scopeAuth).length) {
      return this.authorizeScope(scopeAuth);
    }
    return (req, res, next) => next();
  }
  /**
   * Returns middleware for authenticating with a specific strategy
   */
  static authenticatePassport(strategy, options, callback) {
    return import_passport2.default.authenticate(strategy, options, callback);
  }
  static authenticateUser(options) {
    return async (req, res, next) => {
      const {
        secret = process.env.JWT_SECRET,
        headerKey = "authorization",
        usingBearer = true,
        callback
      } = options;
      const token = this.extractToken({ req, headerKey, usingBearer });
      if (!token) {
        return res.status(401).json({ message: "Authorization token not found" });
      }
      try {
        const jwtSecret = secret || process.env.JWT_SECRET;
        const decoded = import_jsonwebtoken2.default.verify(token, jwtSecret);
        if (callback) {
          const user = await callback(decoded);
          req.user = user ? user : decoded;
        } else {
          req.user = decoded;
        }
        return next();
      } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
    };
  }
  static authorizeRole({
    allowedRoles = [],
    checkAll = true
  }) {
    return (req, res, next) => {
      const userRole = req.user?.role;
      if (!userRole) {
        return res.status(403).json({
          status: "forbidden",
          message: "No role found for the authenticated user. Please ensure your token includes a role."
        });
      }
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: "forbidden",
          message: `Access denied. Required role(s): [${allowedRoles.join(
            ", "
          )}], but found: ${userRole}.`
        });
      }
      next();
    };
  }
  static authorizeScope({
    requiredScopes = [],
    checkAll = true
  }) {
    return (req, res, next) => {
      const userScopes = req.user?.scopes || [];
      let haveScope = false;
      if (checkAll) {
        haveScope = requiredScopes.every((scope) => userScopes.includes(scope));
      } else {
        haveScope = requiredScopes.some((scope) => userScopes.includes(scope));
      }
      if (haveScope) {
        return next();
      }
      const missingScopes = requiredScopes.filter(
        (scope) => !userScopes.includes(scope)
      );
      return res.status(403).json({
        error: "Forbidden",
        message: `Insufficient permissions. Missing required scope(s): [${missingScopes.join(
          ", "
        )}].`,
        userScopes
      });
    };
  }
  static extractToken({
    req,
    headerKey = "authorization",
    usingBearer = true
  }) {
    const headerValue = req.headers[headerKey.toLowerCase()];
    if (!headerValue) return void 0;
    return usingBearer ? headerValue.split(" ")[1] : headerValue;
  }
};

// src/common/async-route-wrapper/index.ts
var AsyncRouteWrapper = class {
  /**
   * Wraps any async/sync function and passes errors to Express
   * @param fn - controller or middleware function
   * @returns Express middleware
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
};

// src/common/body-parser/index.ts
var import_body_parser = __toESM(require("body-parser"), 1);

// src/config/common/bodyParserConfig.ts
var config = {
  getConfig: (config8 = {}) => {
    return {
      json: config8?.json || { limit: "100kb" },
      // Default JSON body limit
      urlencoded: config8?.urlencoded || { extended: true, limit: "100kb" },
      // URL-encoded body
      raw: config8?.raw || { type: "application/octet-stream", limit: "100kb" },
      // Raw body
      text: config8?.text || { type: "text/plain", limit: "100kb" }
      // Text body
    };
  }
};
var bodyParserConfig_default = config;

// src/common/body-parser/index.ts
var BodyParser = class {
  /**
   * Used to setup body parser for app
   * @param app Express app and config
   */
  static init({ app, customConfig = {} }) {
    const config8 = bodyParserConfig_default.getConfig(customConfig);
    if (config8?.json) app.use(import_body_parser.default.json(config8.json));
    if (config8?.urlencoded) app.use(import_body_parser.default.urlencoded(config8.urlencoded));
    if (config8?.raw) app.use(import_body_parser.default.raw(config8.raw));
    if (config8?.text) app.use(import_body_parser.default.text(config8.text));
  }
};

// src/common/compression/index.ts
var import_compression2 = __toESM(require("compression"), 1);

// src/config/common/compressionConfig.ts
var import_compression = __toESM(require("compression"), 1);
var config2 = {
  getConfig: (config8 = {}) => {
    const filter = config8.filter ?? ((req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return import_compression.default.filter(req, res);
    });
    return {
      level: config8.level ?? 6,
      // Compression level (0-9) for Gzip
      threshold: config8.threshold ?? 1024,
      // Only compress responses larger than 1KB
      filter
    };
  }
};
var compressionConfig_default = config2;

// src/common/compression/index.ts
var _initialized;
var CompressionHandler = class {
  /**
   * Set up compression middleware once
   */
  static init({ app, customConfig = {} }) {
    if (__privateGet(this, _initialized)) return;
    const config8 = compressionConfig_default.getConfig(customConfig);
    app.use((0, import_compression2.default)(config8));
    __privateSet(this, _initialized, true);
  }
  /**
   * Direct access to compression middleware
   */
  static getMiddleware(config8 = {}) {
    return (0, import_compression2.default)(config8);
  }
  static isInitialized() {
    return __privateGet(this, _initialized);
  }
};
_initialized = new WeakMap();
__privateAdd(CompressionHandler, _initialized, false);

// src/common/cors/index.ts
var import_cors = __toESM(require("cors"), 1);

// src/config/common/corsConfig.ts
var config3 = {
  corsConfig: {
    origin: (_origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: void 0,
    exposedHeaders: [],
    credentials: false,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
  },
  getConfig: (custom = {}) => {
    return {
      origin: (_origin, callback) => {
        callback(null, true);
      },
      methods: custom.methods || [
        "GET",
        "HEAD",
        "PUT",
        "PATCH",
        "POST",
        "DELETE"
      ],
      allowedHeaders: custom.allowedHeaders || void 0,
      exposedHeaders: custom.exposedHeaders || [],
      credentials: custom.credentials || false,
      maxAge: custom.maxAge || 86400,
      preflightContinue: custom.preflightContinue || false,
      optionsSuccessStatus: custom.optionsSuccessStatus || 204
    };
  }
};
var corsConfig_default = config3;

// src/common/cors/index.ts
var Cors = class {
  /**
   * Used to setup the cors for app
   * @param app Express app
   * @param customConfig config for cors
   */
  static init({
    app,
    customConfig = {}
  }) {
    this.customConfig = corsConfig_default.getConfig(customConfig);
    const config8 = Object.keys(customConfig || {}).length > 0 ? this.getCorsConfig() : { ...this.defaultConfig };
    app.use((0, import_cors.default)(config8));
  }
  /**
   * Used to check allow origin, block origin and return the config
   * @returns config details for cors
   */
  static getCorsConfig() {
    const {
      allowOrigins = [],
      blockOrigins = [],
      ...remainConfig
    } = this.customConfig;
    const originHandler = (origin, callback) => {
      if (!origin) return callback(null, true);
      if (blockOrigins.some(
        (blocked) => typeof blocked !== "boolean" && this.matchOrigin({ origin, pattern: blocked })
      )) {
        return callback(new Error("Blocked by CORS policy"));
      }
      if (allowOrigins.length === 0 || allowOrigins.some(
        (allowed) => typeof allowed !== "boolean" && this.matchOrigin({ origin, pattern: allowed })
      )) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS policy"));
    };
    return {
      ...this.defaultConfig,
      ...remainConfig,
      origin: originHandler
    };
  }
  /**
   * Used to check whether origin is allowed
   */
  static matchOrigin({
    origin,
    pattern
  }) {
    if (typeof pattern === "string") return origin === pattern;
    if (pattern instanceof RegExp) return pattern.test(origin);
    return false;
  }
};

// src/common/dotenv/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var DotEnv = class {
  constructor() {
    this.envLib = import_dotenv.default;
  }
  static init({ customPath = "" }) {
    const envPath = import_path.default.resolve(process.cwd(), customPath || ".env");
    const env = import_dotenv.default.config({ path: envPath });
    if (env.error) {
      throw env.error;
    }
    return env.parsed;
  }
};

// src/common/error/error-handler/index.ts
var ErrorHandler = class {
  static handleGlobalError(err, req, res, next) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
  static handleProcessError() {
    process.on("uncaughtException", (err) => {
      console.error("\u{1F525} Uncaught Exception:", err);
    });
    process.on(
      "unhandledRejection",
      (reason, promise) => {
        console.error("\u{1F6A8} Unhandled Rejection at:", promise, "reason:", reason);
      }
    );
    process.on("SIGINT", () => {
      console.log("\u26A0\uFE0F Process interrupted! Cleaning up...");
      process.exit(1);
    });
    process.on("SIGTERM", () => {
      console.log("\u2705 Process terminated gracefully.");
      process.exit(0);
    });
  }
  static handleNotFoundRoute(req, res, next) {
    return res.status(400).json({
      status: "error",
      message: "Route not found!"
    });
  }
};

// src/common/logger/winston/index.ts
var import_winston2 = require("winston");

// src/config/logger/winstonConfig.ts
var import_winston = require("winston");
var import_winston_daily_rotate_file = __toESM(require("winston-daily-rotate-file"), 1);
var import_path2 = __toESM(require("path"), 1);
var config4 = {
  logConfig: {
    level: "info",
    format: import_winston.format.combine(
      import_winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      // Add a timestamp
      import_winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [
      new import_winston.transports.Console(),
      // Console logs
      new import_winston_daily_rotate_file.default({
        filename: import_path2.default.join("logs", "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: `14d`,
        level: "info"
      }),
      new import_winston_daily_rotate_file.default({
        filename: import_path2.default.join("logs", "errors-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: `30d`,
        level: "error"
      })
    ],
    exitOnError: false
  },
  getConfig: (config8 = {}) => {
    return {
      level: config8?.level || "info",
      format: config8?.format || import_winston.format.combine(
        import_winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // Add a timestamp
        import_winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      ),
      transports: config8?.transports || [
        new import_winston.transports.Console(),
        // Console logs
        new import_winston_daily_rotate_file.default({
          filename: import_path2.default.join("logs", "app-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: `14d`,
          level: "info"
        }),
        new import_winston_daily_rotate_file.default({
          filename: import_path2.default.join("logs", "errors-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: `30d`,
          level: "error"
        })
      ],
      exitOnError: config8?.exitOnError || false
    };
  }
};
var winstonConfig_default = config4;

// src/common/logger/winston/index.ts
var _logger, _initialized2;
var LoggerHandler = class {
  /**
   * Configure the Winston logger (only once)
   */
  static init(customConfig = {}) {
    if (__privateGet(this, _initialized2)) return;
    __privateSet(this, _logger, (0, import_winston2.createLogger)(winstonConfig_default.getConfig(customConfig)));
    __privateSet(this, _initialized2, true);
  }
  /**
   * Middleware for logging requests
   */
  static middleware() {
    if (!__privateGet(this, _logger)) {
      throw new Error("Logger not initialized. Call init() first.");
    }
    return (req, res, next) => {
      __privateGet(this, _logger).info(
        `${req.method} ${req.url} - ${req.ip}${req.requestId ? ` | Request ID: ${req.requestId}` : ""}`
      );
      next();
    };
  }
  /**
   * Get logger instance
   */
  static getLogger() {
    if (!__privateGet(this, _logger)) {
      throw new Error("Logger not initialized.");
    }
    return __privateGet(this, _logger);
  }
  /**
   * Check if logger is already initialized
   */
  static isInitialized() {
    return __privateGet(this, _initialized2);
  }
};
_logger = new WeakMap();
_initialized2 = new WeakMap();
__privateAdd(LoggerHandler, _logger, null);
__privateAdd(LoggerHandler, _initialized2, false);
LoggerHandler.init();
var logger = LoggerHandler.getLogger();

// src/common/security/express-rate-limit/index.ts
var import_express_rate_limit = require("express-rate-limit");

// src/config/security/expressRateLimitConfig.ts
var config5 = {
  getConfig: (config8 = {}) => {
    return {
      windowMs: config8?.windowMs || 6e4,
      // 1 minute in milliseconds
      limit: config8?.limit || 5,
      // Max requests per minute
      message: config8?.message || "Too many requests, please try again later.",
      statusCode: config8?.statusCode || 429,
      // Status code when rate limit is exceeded
      handler: config8?.handler || (() => {
      }),
      // Optional custom handler function for exceeded limit
      legacyHeaders: config8?.legacyHeaders || true,
      // Enable legacy X-RateLimit-* headers
      standardHeaders: config8?.standardHeaders || "draft-6",
      // Use IETF draft-6 rate-limiting headers
      identifier: config8?.identifier || void 0,
      // Optional custom identifier for the policy
      store: config8?.store || void 0,
      // Uses in-memory store by default
      passOnStoreError: config8?.passOnStoreError || false,
      // Do not pass if store fails (defaults to false)
      keyGenerator: config8?.keyGenerator || ((req) => req.ip),
      // Identify users by their IP address
      requestPropertyName: config8?.requestPropertyName || "rateLimit",
      // Store rate limit info in `req.rateLimit`
      skip: config8?.skip || (() => false),
      // Don't skip any requests by default
      skipSuccessfulRequests: config8?.skipSuccessfulRequests || false,
      // Count 1xx/2xx/3xx responses
      skipFailedRequests: config8?.skipFailedRequests || false,
      // Count 4xx/5xx responses
      requestWasSuccessful: config8?.requestWasSuccessful || ((req, res) => res.statusCode < 400),
      // Check if request was successful
      validate: config8?.validate || true
      // Enable config validation
    };
  }
};
var expressRateLimitConfig_default = config5;

// src/common/security/express-rate-limit/index.ts
var _initialized3, _rateLimiterMiddleware;
var RateLimitHandler = class {
  /**
   * Setup rate limit middleware on the app (once only)
   * @param app Express app instance
   * @param customConfig Optional custom rate limit config
   */
  static init({ app, customConfig = {} }) {
    if (__privateGet(this, _initialized3)) return;
    const config8 = expressRateLimitConfig_default.getConfig(customConfig);
    __privateSet(this, _rateLimiterMiddleware, (0, import_express_rate_limit.rateLimit)(config8));
    app.use(__privateGet(this, _rateLimiterMiddleware));
    __privateSet(this, _initialized3, true);
  }
  static isInitialized() {
    return __privateGet(this, _initialized3);
  }
};
_initialized3 = new WeakMap();
_rateLimiterMiddleware = new WeakMap();
__privateAdd(RateLimitHandler, _initialized3, false);
__privateAdd(RateLimitHandler, _rateLimiterMiddleware, null);

// src/common/security/helmet/index.ts
var import_helmet = __toESM(require("helmet"), 1);

// src/config/security/helmetConfig.ts
var config6 = {
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
    xssFilter: true
  },
  getConfig: (config8 = {}) => {
    return {
      contentSecurityPolicy: config8?.contentSecurityPolicy || false,
      crossOriginEmbedderPolicy: config8?.crossOriginEmbedderPolicy || false,
      crossOriginOpenerPolicy: config8?.crossOriginEmbedderPolicy || false,
      dnsPrefetchControl: config8?.dnsPrefetchControl || true,
      frameguard: config8?.frameguard || true,
      hidePoweredBy: config8?.hidePoweredBy || false,
      hsts: config8?.hsts || {
        maxAge: 0,
        includeSubDomains: false,
        preload: false
      },
      ieNoOpen: config8?.ieNoOpen || false,
      noSniff: config8?.noSniff || false,
      originAgentCluster: config8?.originAgentCluster || false,
      referrerPolicy: config8?.referrerPolicy || true,
      xssFilter: config8?.xssFilter || true
    };
  }
};
var helmetConfig_default = config6;

// src/common/security/helmet/index.ts
var SecurityHandler = class {
  /**
   * Used to setup the security using helmet for app
   * @param app Express app
   * @param customConfig custom configuration if modification needed
   */
  static init({ app, customConfig = {} }) {
    this.config = helmetConfig_default?.getConfig(customConfig);
    app.use((0, import_helmet.default)(this.config));
  }
};

// src/framework/express/index.ts
var import_express = __toESM(require("express"), 1);

// src/config/middleware/express-session.config.ts
var sessionConfig = {
  getConfig: (config8 = {}) => {
    const defaultCookie = {
      maxAge: 24 * 60 * 60 * 1e3,
      // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: void 0,
      expires: void 0
    };
    return {
      secret: process.env.SESSION_SECRET || "d9X#7vLp@8QwR!ZmFs3$GtjB2kVyN&Hz0",
      resave: false,
      saveUninitialized: false,
      rolling: false,
      proxy: process.env.NODE_ENV === "production",
      cookie: {
        ...defaultCookie,
        ...config8.cookie || {}
      },
      ...config8
    };
  }
};
var express_session_config_default = sessionConfig;

// src/framework/express/index.ts
var import_express_session2 = __toESM(require("express-session"), 1);
var _app, _initialized4, _ExpressPack_static, applyMiddleware_fn;
var ExpressPack = class {
  /**
   * Initializes the express app with provided middleware config
   * @param config Middleware configuration object
   * @returns express app
   */
  static async init({
    app,
    config: config8 = {}
  }) {
    if (__privateGet(this, _initialized4) && __privateGet(this, _app)) return __privateGet(this, _app);
    __privateSet(this, _app, app);
    __privateGet(this, _app).use((req, res, next) => {
      const requestId = req.headers["x-request-id"] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader("X-Request-ID", requestId);
      next();
    });
    const expressSessionConfig = express_session_config_default.getConfig(config8?.sessionConfig);
    __privateGet(this, _app).use((0, import_express_session2.default)(expressSessionConfig));
    for (const [key, value] of Object.entries(config8)) {
      __privateMethod(this, _ExpressPack_static, applyMiddleware_fn).call(this, { key, value });
    }
    __privateSet(this, _initialized4, true);
    return __privateGet(this, _app);
  }
  /**
   * Returns the initialized app instance
   */
  static getApp() {
    if (!__privateGet(this, _initialized4) || !__privateGet(this, _app)) {
      throw new Error(
        "Express app not initialized. Call ExpressPack.init() first."
      );
    }
    return __privateGet(this, _app);
  }
  /**
   * Returns new Router instance
   */
  static getRouter() {
    return import_express.default.Router();
  }
  /**
   * Binds routes to app after init
   * @param routes Array of route config { path, route }
   */
  static initRoutes({ routes = [] }) {
    if (!__privateGet(this, _initialized4) || !__privateGet(this, _app)) {
      throw new Error("Cannot bind routes before app initialization.");
    }
    routes.forEach(({ prefix = "", version = "", route: routeList = [] }) => {
      const basePath = prefix + version;
      routeList.forEach(({ path: path3, route }) => {
        const fullPath = basePath ? basePath + path3 : path3;
        __privateGet(this, _app).use(fullPath, route);
      });
    });
  }
  /**
   * Check if app is initialized
   */
  static isInitialized() {
    return __privateGet(this, _initialized4);
  }
};
_app = new WeakMap();
_initialized4 = new WeakMap();
_ExpressPack_static = new WeakSet();
applyMiddleware_fn = function({ key, value }) {
  switch (key) {
    case "bodyParser":
      BodyParser.init({ app: __privateGet(this, _app), customConfig: value });
      break;
    case "cors":
      Cors.init({ app: __privateGet(this, _app), customConfig: value });
      break;
    case "env":
      DotEnv.init({ customPath: value });
      break;
    case "logger":
      LoggerHandler.init(value);
      __privateGet(this, _app).use(LoggerHandler.middleware());
      break;
    case "security":
      SecurityHandler.init({ app: __privateGet(this, _app), customConfig: value });
      break;
    case "compression":
      CompressionHandler.init({
        app: __privateGet(this, _app),
        customConfig: value
      });
      break;
    case "express-rate-limit":
      RateLimitHandler.init({
        app: __privateGet(this, _app),
        customConfig: value
      });
      break;
    default:
      console.warn(`[ExpressPack] Unknown middleware key: ${key}`);
  }
};
__privateAdd(ExpressPack, _ExpressPack_static);
__privateAdd(ExpressPack, _app, null);
__privateAdd(ExpressPack, _initialized4, false);

// src/middleware/request-tracer/index.ts
var RequestTracer = class {
  static addRequestId(req, res, next) {
    const requestId = req.headers["x-request-id"] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
  }
};

// src/middleware/request-validator/index.ts
var import_zod = require("zod");
var RequestValidator = class {
  static validateRequest({ params, query, body }) {
    return (req, res, next) => {
      try {
        const parsed = {
          ...params ? params.parse(req.params) : {},
          ...query ? query.parse(req.query) : {},
          ...body ? body.parse(req.body) : {}
        };
        req.data = parsed;
        next();
      } catch (err) {
        if (err instanceof import_zod.ZodError) {
          return res.status(400).json({ error: err.flatten() });
        }
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
};

// src/plugin/mongoose/core/index.ts
var import_slugify = __toESM(require("slugify"), 1);
var MongooseCorePlugin = class {
  static Timestamps(schema) {
    schema.add({
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    schema.pre(
      "save",
      function(next) {
        if (!this.createdAt) this.createdAt = /* @__PURE__ */ new Date();
        this.updatedAt = /* @__PURE__ */ new Date();
        next();
      }
    );
    schema.pre(
      "findOneAndUpdate",
      function(next) {
        this.set({ updatedAt: /* @__PURE__ */ new Date() });
        next();
      }
    );
  }
  static SoftDelete(schema) {
    schema.add({
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null }
    });
    schema.methods.softDelete = async function() {
      if (!this.isDeleted) {
        this.isDeleted = true;
        this.deletedAt = /* @__PURE__ */ new Date();
        return this.save();
      }
      throw new Error("Document is already deleted");
    };
    schema.query.notDeleted = function() {
      return this.where({ isDeleted: false });
    };
    schema.query.withDeleted = function() {
      return this.where({ isDeleted: true });
    };
    const excludeDeleted = function(next) {
      this.where({ isDeleted: false });
      next();
    };
    schema.pre("find", excludeDeleted);
    schema.pre("findOne", excludeDeleted);
    schema.pre("countDocuments", excludeDeleted);
  }
  static SlugGenerator(schema, options = {}) {
    const { sourceField = "name", slugField = "slug", unique = true } = options;
    schema.add({ [slugField]: { type: String, unique } });
    schema.pre(
      "validate",
      async function(next) {
        const sourceValue = this[sourceField];
        if (!this[slugField] && sourceValue) {
          let baseSlug = (0, import_slugify.default)(sourceValue, {
            lower: true,
            strict: true
          });
          if (!baseSlug || baseSlug === "") baseSlug = "untitled-slug";
          let slug = baseSlug;
          let count = 1;
          const query = { [slugField]: slug };
          if (this._id) query._id = { $ne: this._id };
          const ModelConstructor = this.constructor;
          const checkUniqueness = async () => {
            const existing = await ModelConstructor.exists(query).setOptions({
              skipTenantCheck: true
            });
            if (existing) {
              slug = `${baseSlug}-${count++}`;
              query[slugField] = slug;
              return checkUniqueness();
            }
            return slug;
          };
          this[slugField] = await checkUniqueness();
        }
        next();
      }
    );
  }
  static Versioning(schema) {
    const versionField = "__versions";
    schema.add({
      [versionField]: { type: Array, default: [] }
    });
    schema.pre("save", function(next) {
      if (!this.isNew && this.isModified()) {
        const clone = this.toObject({
          depopulate: true,
          virtuals: false,
          getters: false
        });
        delete clone[versionField];
        this[versionField] = this[versionField] || [];
        this[versionField].push({
          version: this[versionField].length + 1,
          data: clone,
          savedAt: /* @__PURE__ */ new Date()
        });
        if (this[versionField].length > 10) {
          this[versionField].shift();
        }
      }
      next();
    });
  }
  static MultiTenancy(schema, options = {}) {
    const field = options.field || "shopId";
    schema.add({ [field]: { type: String, required: true, index: true } });
    const addTenantScope = function(next) {
      const op = this.op;
      const skipTenantCheck = this.getOptions()?.skipTenantCheck;
      if (skipTenantCheck || op === "save") {
        return next();
      }
      if (!this.getQuery()[field] && this.options?.tenantId) {
        this.where({ [field]: this.options.tenantId });
      }
      if (!this.getQuery()[field] && !this.options?.tenantId) {
        return next(new Error("Tenant ID is required but was not provided."));
      }
      next();
    };
    schema.pre("save", function(next) {
      if (!this[field] && this.tenantId) {
        this[field] = this.tenantId;
      }
      if (!this[field]) {
        return next(
          new Error(`The ${field} is required to save this document.`)
        );
      }
      next();
    });
    schema.pre("find", addTenantScope);
    schema.pre("findOne", addTenantScope);
    schema.pre("countDocuments", addTenantScope);
  }
  static Pagination(schema) {
    schema.statics.paginate = async function({
      page = 1,
      limit = 10,
      filter = {},
      sort = {}
    } = {}) {
      if (page <= 0) page = 1;
      if (limit <= 0) limit = 10;
      const skip = (page - 1) * limit;
      const [results, total] = await Promise.all([
        this.find(filter).sort(sort).skip(skip).limit(limit),
        this.countDocuments(filter)
      ]);
      return {
        results,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    };
  }
};

// src/plugin/mongoose/performance/index.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var MongoosePerformancePlugin = class {
  // 1. Index Manager Plugin
  static IndexManager(schema, options = { indexes: [] }) {
    return function(schema2) {
      const { indexes } = options;
      const db = import_mongoose.default.connection.db;
      if (!db) {
        console.warn("MongoDB connection not established yet.");
        return;
      }
      indexes.forEach((index) => {
        if (!schema2.path(index.field)) {
          console.warn(`Index field ${index.field} not found in schema`);
          return;
        }
        schema2.index({ [index.field]: index.type || 1 }, index.options || {});
      });
      schema2.post("save", function(doc) {
        const db2 = import_mongoose.default.connection.db;
        if (!db2) {
          console.warn("MongoDB connection not established yet.");
          return;
        }
        const collectionName = doc.constructor.collection?.name;
        if (!collectionName) {
          console.warn("Collection name is not accessible");
          return;
        }
        indexes.forEach(async (index) => {
          try {
            const indexesCursor = db2.collection(collectionName).listIndexes();
            const existingIndexes = await indexesCursor.toArray();
            const indexExists = existingIndexes.some(
              (i) => i.name === index.name
            );
            if (!indexExists) {
              console.error(
                `Missing index ${index.name} in collection ${collectionName}`
              );
            }
          } catch (error) {
            console.error("Error checking indexes:", error);
          }
        });
      });
    };
  }
  // 2. Retry Handler Plugin
  static RetryHandler(schema, options = { retries: 3, delay: 1e3 }) {
    const { retries, delay } = options;
    schema.methods.saveWithRetry = async function() {
      let attempt = 0;
      while (attempt <= retries) {
        try {
          return await this.save();
        } catch (err) {
          if (attempt < retries) {
            attempt++;
            console.warn(
              `Retrying save attempt #${attempt} due to error: ${err.message}`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw err;
          }
        }
      }
    };
  }
};

// src/plugin/mongoose/populate/index.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var MongoosePopulatePlugin = class {
  static AutoPopulate(schema, options = { paths: [] }) {
    return function(schema2) {
      const { paths } = options;
      const preHook = function() {
        this.populate(paths);
      };
      schema2.pre("find", preHook);
      schema2.pre("findOne", preHook);
      schema2.pre("findOneAndUpdate", preHook);
      schema2.pre("updateOne", preHook);
      schema2.pre("save", function(next) {
        paths.forEach((path3) => {
          if (this[path3] && import_mongoose2.default.isObjectIdOrHexString(this[path3])) {
            this.populate(path3);
          }
        });
        next();
      });
    };
  }
  static SmartPopulation(schema, options = { maxDepth: 3, fields: {} }) {
    return function(schema2) {
      const { maxDepth, fields } = options;
      const isMaxDepthExceeded = (depth) => depth > maxDepth;
      const buildPopulateQuery = (field, depth = 1) => {
        if (isMaxDepthExceeded(depth)) return field;
        const fieldPopulation = fields[field];
        if (!fieldPopulation) return field;
        return {
          path: field,
          select: fieldPopulation.select || void 0,
          populate: fieldPopulation.populate ? buildPopulateQuery(fieldPopulation.populate, depth + 1) : void 0
        };
      };
      const preHook = function() {
        const populateQuery = Object.keys(fields).map(
          (field) => buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      };
      schema2.pre("find", preHook);
      schema2.pre("findOne", preHook);
      schema2.pre("findOneAndUpdate", preHook);
      schema2.pre("updateOne", preHook);
      schema2.pre("save", function(next) {
        Object.keys(fields).forEach((field) => {
          if (this[field] && import_mongoose2.default.isObjectIdOrHexString(this[field])) {
            this.populate(buildPopulateQuery(field));
          }
        });
        next();
      });
    };
  }
};

// src/plugin/mongoose/security/index.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_sanitize_html = __toESM(require("sanitize-html"), 1);
var MongooseSecurityPlugin = class {
  static Sanitization(schema) {
    schema.pre(
      "save",
      function(next) {
        const sanitize = (value) => {
          if (typeof value === "string") {
            return (0, import_sanitize_html.default)(value, {
              allowedTags: [],
              allowedAttributes: {}
            });
          }
          return value;
        };
        Object.keys(this.toObject()).forEach((field) => {
          if (this[field] && typeof this[field] === "string" && this[field].trim() !== "") {
            this[field] = sanitize(this[field]);
          }
        });
        next();
      }
    );
  }
  static FieldEncryption(schema, options = { fields: [] }) {
    const { fields } = options;
    schema.pre(
      "save",
      async function(next) {
        for (const field of fields) {
          if (this[field]) {
            const salt = await import_bcryptjs.default.genSalt(10);
            this[field] = await import_bcryptjs.default.hash(this[field], salt);
          }
        }
        next();
      }
    );
    schema.methods.decryptFields = function() {
      const decryptedData = {};
      fields.forEach((field) => {
        if (this[field]) decryptedData[field] = this[field];
      });
      return decryptedData;
    };
    schema.methods.comparePassword = async function(password) {
      return import_bcryptjs.default.compare(password, this.password);
    };
  }
  static UniqueConstraint(schema, options) {
    const { fields, messages = {} } = options;
    fields.forEach((field) => {
      schema.pre(
        "save",
        async function(next) {
          if (this.isNew || this.isModified(field)) {
            const query = { [field]: this[field] };
            if (this._id) query._id = { $ne: this._id };
            const existingDoc = await this.constructor.findOne(query).setOptions({ skipTenantCheck: true });
            if (existingDoc) {
              const errorMessage = messages[field] || `${field} already exists.`;
              const error = new Error(errorMessage);
              error.name = "ValidationError";
              next(error);
              return;
            }
          }
          next();
        }
      );
      schema.pre(
        "findOneAndUpdate",
        async function(next) {
          const update = this.getUpdate();
          if (update && update[field]) {
            const query = { [field]: update[field] };
            if (this._id) query._id = { $ne: this._id };
            const existingDoc = await this.model.findOne(query).setOptions({ skipTenantCheck: true });
            if (existingDoc) {
              const errorMessage = messages[field] || `${field} already exists.`;
              const error = new Error(errorMessage);
              error.name = "ValidationError";
              next(error);
              return;
            }
          }
          next();
        }
      );
    });
  }
  static SchemaValidation(schema, options = { validate: {} }) {
    const { validate } = options;
    schema.pre(
      "save",
      async function(next) {
        try {
          Object.keys(validate).forEach((field) => {
            const validationSchema = validate[field];
            if (this[field]) {
              validationSchema.parse(this[field]);
            }
          });
          next();
        } catch (err) {
          next(err);
        }
      }
    );
    schema.methods.validateSchema = function(data) {
      try {
        Object.keys(validate).forEach((field) => {
          const validationSchema = validate[field];
          if (data[field]) {
            validationSchema.parse(data[field]);
          }
        });
      } catch (err) {
        throw new Error(`Validation failed for ${err.message}`);
      }
    };
  }
};

// src/plugin/index.ts
var availablePlugins = {
  timestamps: MongooseCorePlugin.Timestamps,
  softDelete: MongooseCorePlugin.SoftDelete,
  slugGenerator: MongooseCorePlugin.SlugGenerator,
  versioning: MongooseCorePlugin.Versioning,
  multiTenancy: MongooseCorePlugin.MultiTenancy,
  pagination: MongooseCorePlugin.Pagination,
  indexManager: MongoosePerformancePlugin.IndexManager,
  retryHandler: MongoosePerformancePlugin.RetryHandler,
  autoPopulate: MongoosePopulatePlugin.AutoPopulate,
  smartPopulate: MongoosePopulatePlugin.SmartPopulation,
  sanitize: MongooseSecurityPlugin.Sanitization,
  fieldEncryption: MongooseSecurityPlugin.FieldEncryption,
  uniqueConstraint: MongooseSecurityPlugin.UniqueConstraint,
  schemaValidation: MongooseSecurityPlugin.SchemaValidation
};

// src/service/cache/redis/index.ts
var import_ioredis = __toESM(require("ioredis"), 1);
var _RedisClientService = class _RedisClientService {
  constructor() {
    if (_RedisClientService.instance) {
      return _RedisClientService.instance;
    }
    _RedisClientService.instance = this;
  }
  static enableRedis(enable = true, config8) {
    _RedisClientService.isRedisEnabled = enable;
    if (enable) {
      _RedisClientService.init(config8);
    } else {
      _RedisClientService.disconnect();
    }
  }
  static init(config8) {
    if (_RedisClientService.isRedisEnabled && !_RedisClientService.connected) {
      _RedisClientService.redis = new import_ioredis.default({
        host: config8.REDIS_HOST || "localhost",
        port: Number(config8.REDIS_PORT) || 6379,
        password: config8.REDIS_PASSWORD || void 0,
        db: Number(config8.REDIS_DB) || 0
      });
      _RedisClientService.redis.on("connect", () => {
        _RedisClientService.connected = true;
        console.info("Connected to Redis");
      });
      _RedisClientService.redis.on("error", (err) => {
        console.error("Redis connection error: ", err);
        _RedisClientService.connected = false;
      });
    }
  }
  static async set(key, value, options) {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping set operation.");
      return;
    }
    try {
      if (options?.expire) {
        await _RedisClientService.redis.set(key, value, "EX", options.expire);
      } else {
        await _RedisClientService.redis.set(key, value);
      }
      console.info(`Key "${key}" set successfully.`);
    } catch (err) {
      console.error("Error setting key:", err);
    }
  }
  static async get(key) {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping get operation.");
      return;
    }
    try {
      const value = await _RedisClientService.redis.get(key);
      if (value === null) {
        console.info(`Key "${key}" not found.`);
        return null;
      }
      return value;
    } catch (err) {
      console.error("Error getting key:", err);
    }
  }
  static async del(key) {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping delete operation.");
      return;
    }
    try {
      const result = await _RedisClientService.redis.del(key);
      if (result === 1) {
        console.info(`Key "${key}" deleted successfully.`);
      } else {
        console.info(`Key "${key}" not found.`);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  }
  static async expire(key, seconds) {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping expiration operation.");
      return;
    }
    try {
      await _RedisClientService.redis.expire(key, seconds);
      console.info(`Key "${key}" will expire in ${seconds} seconds.`);
    } catch (err) {
      console.error("Error setting expiration:", err);
    }
  }
  static async keys(pattern = "*") {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Skipping keys operation.");
      return [];
    }
    try {
      const keys = await _RedisClientService.redis.keys(pattern);
      return keys;
    } catch (err) {
      console.error("Error retrieving keys:", err);
    }
  }
  static getClient() {
    if (!_RedisClientService.isRedisEnabled) {
      console.info("Redis is disabled. Returning null client.");
      return null;
    }
    return _RedisClientService.redis;
  }
  static disconnect() {
    if (_RedisClientService.redis) {
      _RedisClientService.redis.disconnect();
      console.info("Disconnected from Redis");
    }
    _RedisClientService.connected = false;
  }
};
_RedisClientService.instance = null;
_RedisClientService.redis = null;
_RedisClientService.connected = false;
_RedisClientService.isRedisEnabled = false;
var RedisClientService = _RedisClientService;

// src/service/db/mongoose/connection/index.ts
var import_mongoose4 = __toESM(require("mongoose"), 1);
var _instance, _isConnected, _uri, _options, _Mongoose_static, connect_fn, reconnect_fn;
var _Mongoose = class _Mongoose {
  constructor() {
    if (__privateGet(_Mongoose, _instance)) return __privateGet(_Mongoose, _instance);
    __privateSet(_Mongoose, _instance, this);
    import_mongoose4.default.connection.on("connected", () => {
      __privateSet(_Mongoose, _isConnected, true);
      console.info("[MongoDB] Connected");
    });
    import_mongoose4.default.connection.on("disconnected", () => {
      __privateSet(_Mongoose, _isConnected, false);
      console.info("[MongoDB] Disconnected. Retrying in 5s...");
      setTimeout(() => {
        var _a;
        return __privateMethod(_a = _Mongoose, _Mongoose_static, reconnect_fn).call(_a);
      }, 5e3);
    });
    import_mongoose4.default.connection.on("error", (err) => {
      console.error("[MongoDB] Connection error:", err);
    });
  }
  static async init({ uri, options = {} }) {
    var _a;
    if (!uri) {
      throw new Error("[MongoDB] URI is required to connect");
    }
    __privateSet(_Mongoose, _uri, uri);
    __privateSet(_Mongoose, _options, options);
    if (!__privateGet(_Mongoose, _instance)) {
      new _Mongoose();
    }
    if (!__privateGet(_Mongoose, _isConnected)) {
      await __privateMethod(_a = _Mongoose, _Mongoose_static, connect_fn).call(_a);
    }
  }
  static getMongoose() {
    return import_mongoose4.default;
  }
};
_instance = new WeakMap();
_isConnected = new WeakMap();
_uri = new WeakMap();
_options = new WeakMap();
_Mongoose_static = new WeakSet();
connect_fn = async function() {
  try {
    await import_mongoose4.default.connect(__privateGet(_Mongoose, _uri), __privateGet(_Mongoose, _options));
  } catch (err) {
    console.error("[MongoDB] Initial connect failed. Retrying...");
    setTimeout(() => {
      var _a;
      return __privateMethod(_a = _Mongoose, _Mongoose_static, reconnect_fn).call(_a);
    }, 5e3);
  }
};
reconnect_fn = async function() {
  if (!__privateGet(_Mongoose, _isConnected) && __privateGet(_Mongoose, _uri)) {
    try {
      await import_mongoose4.default.connect(__privateGet(_Mongoose, _uri), __privateGet(_Mongoose, _options));
    } catch (err) {
      console.error("[MongoDB] Reconnect failed. Retrying...");
      setTimeout(() => {
        var _a;
        return __privateMethod(_a = _Mongoose, _Mongoose_static, reconnect_fn).call(_a);
      }, 5e3);
    }
  }
};
__privateAdd(_Mongoose, _Mongoose_static);
__privateAdd(_Mongoose, _instance, null);
__privateAdd(_Mongoose, _isConnected, false);
__privateAdd(_Mongoose, _uri, "");
__privateAdd(_Mongoose, _options, {});
var Mongoose = _Mongoose;

// src/service/db/mongoose/model/index.ts
var import_mongoose5 = __toESM(require("mongoose"), 1);
var ModelBuilder = class {
  static build({
    name,
    schemaDefinition,
    schemaOptions = {},
    plugins = {}
  }) {
    if (!name || !schemaDefinition) {
      throw new Error("Model name and schema definition are required.");
    }
    if (import_mongoose5.default.models[name]) {
      return import_mongoose5.default.models[name];
    }
    const schema = new import_mongoose5.default.Schema(schemaDefinition, schemaOptions);
    for (const pluginKey of Object.keys(plugins)) {
      const pluginFn = availablePlugins[pluginKey];
      const pluginValue = plugins[pluginKey];
      if (pluginFn && typeof pluginFn === "function") {
        if (pluginValue === true) {
          pluginFn(schema);
        } else {
          pluginFn(schema, pluginValue);
        }
      }
    }
    return import_mongoose5.default.model(name, schema);
  }
};

// src/service/message/email/node-mailer/transporter/index.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var NodeMailerTransporter = class {
  static create() {
    return import_nodemailer.default.createTransport({
      host: process?.env?.SMTP_HOST,
      port: process?.env?.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process?.env?.SMTP_SECURE === "true",
      auth: {
        user: process?.env?.SMTP_USER,
        pass: process?.env?.SMTP_PASS
      }
    });
  }
};

// src/config/email-template/index.ts
var email_template_default = {
  welcome: ({ data }) => ({
    subject: `Welcome, ${data?.name}`,
    html: `<h1>Hello ${data?.name},</h1><p>We're happy to have you!</p>`
  }),
  resetPassword: ({ data }) => ({
    subject: "Reset Your Password",
    html: `<p>Click <a href="https://example.com/reset/${data?.token}">here</a> to reset your password.</p>`
  }),
  orderConfirmed: ({ data }) => ({
    subject: `Order #${data?.orderId} Confirmed`,
    html: `<p>Your order <strong>#${data?.orderId}</strong> has been confirmed.</p>`
  })
};

// src/service/message/email/node-mailer/email-service/index.ts
var _NodeMailerService = class _NodeMailerService {
  static init() {
    if (!_NodeMailerService.transporter) {
      _NodeMailerService.transporter = NodeMailerTransporter.create();
    }
  }
  static async getTemplate({
    templateName,
    templateParams
  }) {
    return email_template_default?.[templateName]?.({
      data: templateParams
    });
  }
  static async sendEmail({
    to,
    templateName,
    templateParams = {}
  }) {
    if (!_NodeMailerService.transporter) {
      throw new Error(
        "NodeMailerService not initialized. Please initialize first."
      );
    }
    const template = await _NodeMailerService.getTemplate({
      templateName,
      templateParams
    });
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    const { subject, html } = template;
    return _NodeMailerService.transporter.sendMail({
      from: _NodeMailerService.defaultFrom,
      to,
      subject,
      html
    });
  }
};
_NodeMailerService.transporter = null;
_NodeMailerService.defaultFrom = process?.env?.DEFAULT_EMAIL_FROM;
var NodeMailerService = _NodeMailerService;

// src/service/message/sms/twilio/index.ts
var import_twilio = __toESM(require("twilio"), 1);
var import_handlebars = __toESM(require("handlebars"), 1);
var _SMSService = class _SMSService {
  constructor() {
  }
  static init(config8) {
    if (!config8.accountSid || !config8.authToken || !config8.fromNumber) {
      throw new Error(
        "Twilio accountSid, authToken, and fromNumber are required"
      );
    }
    _SMSService.client = (0, import_twilio.default)(config8.accountSid, config8.authToken);
    _SMSService.fromNumber = config8.fromNumber;
    _SMSService.logger = config8.logger || _SMSService.logger;
    if (!_SMSService.instance) {
      _SMSService.instance = new _SMSService();
    }
  }
  static async sendSMS(options) {
    if (!_SMSService.instance) {
      throw new Error("SMSService is not initialized. Call init() first.");
    }
    try {
      await _SMSService.client.messages.create({
        to: options.to,
        from: _SMSService.fromNumber,
        body: options.body
      });
      _SMSService.logger(`SMS sent to ${options.to}`);
    } catch (error) {
      _SMSService.logger("Error sending SMS", error);
      throw error;
    }
  }
  static async sendTemplatedSMS(options) {
    if (!_SMSService.instance) {
      throw new Error("SMSService is not initialized. Call init() first.");
    }
    if (!options.template) {
      throw new Error("Template name is required for templated SMS.");
    }
    const renderedBody = await _SMSService.renderTemplate(
      options.template,
      options.dynamicData
    );
    await _SMSService.sendSMS({
      to: options.to,
      body: renderedBody
    });
  }
  static async renderTemplate(template, data) {
    try {
      const compiled = import_handlebars.default.compile(template);
      return compiled(data);
    } catch (err) {
      _SMSService.logger(`Error rendering SMS template: ${template}`, err);
      throw err;
    }
  }
};
_SMSService.instance = null;
_SMSService.fromNumber = "";
_SMSService.logger = console.log;
var SMSService = _SMSService;

// src/service/payment/stripe/index.ts
var import_stripe = __toESM(require("stripe"), 1);
var StripeService = class {
  // Expose stripe via getter — throws if not initialized (no null checks everywhere)
  static get stripe() {
    if (!this._stripe)
      throw new Error(
        "Stripe has not been initialized. Call StripeService.init() first."
      );
    return this._stripe;
  }
  // -----------------------
  // ⚙️ Initialization
  // -----------------------
  static init(secretKey, config8) {
    if (!secretKey)
      throw new Error("Stripe secret key is required for initialization");
    if (!this.stripe) {
      this._stripe = new import_stripe.default(secretKey, config8?.stripeOptions || {});
      this.webhookSecret = config8?.webhookSecret;
      if (config8?.logFn) this.logFn = config8.logFn;
      if (config8?.defaultCurrency)
        this.defaultCurrency = config8.defaultCurrency;
      if (config8?.defaultPaymentMethodTypes)
        this.defaultPaymentMethodTypes = config8.defaultPaymentMethodTypes;
      if (config8?.retry)
        this.retryConfig = { ...this.retryConfig, ...config8.retry };
      if (typeof config8?.debug === "boolean") this.debug = config8.debug;
      this.log("Stripe initialized");
    } else {
      this.log("Stripe already initialized, skipping.");
    }
    if (config8?.webhookEvents)
      this.registerWebhookEvents({ events: config8.webhookEvents });
  }
  // -----------------------
  // 🔔 Webhook Handling (supports wildcards like invoice.* or *)
  // -----------------------
  static registerWebhookEvent(event, callback) {
    this.webhookHandlers.push({ event, callback });
    this.log(`Registered handler for: ${event}`);
  }
  static registerWebhookEvents({
    events
  }) {
    this.webhookHandlers.push(...events);
  }
  static clearWebhookHandlers() {
    this.webhookHandlers = [];
    this.log("Cleared all webhook handlers");
  }
  static matchEventPattern(pattern, actual) {
    if (pattern === "*") return true;
    if (pattern.includes("*")) {
      const escaped = pattern.split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      const regex = new RegExp(`^${escaped}$`);
      return regex.test(actual);
    }
    return pattern === actual;
  }
  static async handleWebhook(rawBody, sigHeader) {
    if (!this.webhookSecret || !this.stripe) {
      throw new Error("Stripe or Webhook secret not initialized");
    }
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sigHeader,
        this.webhookSecret
      );
      this.log(`Webhook verified: ${event.type}`);
    } catch (err) {
      this.log("Webhook signature verification failed:", err);
      throw err;
    }
    const handlers = this.webhookHandlers.filter(
      (h) => this.matchEventPattern(h.event, event.type)
    );
    if (handlers.length === 0) {
      this.log(
        `No handlers registered for ${event.type} - invoked fallback if present`
      );
      const fallback = this.webhookHandlers.find((h) => h.event === "*");
      if (fallback) {
        try {
          await fallback.callback(event);
        } catch (err) {
          this.log(`Error in fallback handler for ${event.type}:`, err);
        }
      }
    }
    for (const handler of handlers) {
      try {
        await handler.callback(event);
      } catch (err) {
        this.log(`Error in handler for ${event.type}:`, err);
      }
    }
    return event;
  }
  // -----------------------
  // 👤 Tenant Customer (improved search + optional direct ID usage)
  // -----------------------
  static async createTenantCustomer(tenantId, params = {}) {
    const merged = {
      email: params.email,
      metadata: { tenantId, ...params.metadata || {} },
      ...params
    };
    return await this.execute(() => this.stripe.customers.create(merged));
  }
  static async getTenantCustomer(tenantId) {
    try {
      const q = `metadata['tenantId']:'${tenantId.replace(/'/g, "\\'")}'`;
      const res = await this.execute(
        () => this.stripe.customers.search({ query: q, limit: 1 })
      );
      if (res && res.data && res.data.length)
        return res.data[0];
    } catch (err) {
      this.log(
        "customers.search failed or not supported; falling back to list with pagination",
        err
      );
      let startingAfter = void 0;
      do {
        const list = await this.execute(
          () => this.stripe.customers.list({
            limit: 100,
            starting_after: startingAfter
          })
        );
        const found = list.data.find(
          (c) => c.metadata && c.metadata.tenantId === tenantId
        );
        if (found) return found;
        if (!list.has_more) break;
        startingAfter = list.data[list.data.length - 1].id;
      } while (startingAfter);
    }
    return null;
  }
  static async updateTenantCustomer(tenantId, updateData) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.execute(
      () => this.stripe.customers.update(customer.id, updateData)
    );
  }
  static async deleteTenantCustomer(tenantId) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    return await this.execute(() => this.stripe.customers.del(customer.id));
  }
  // -----------------------
  // 📦 Subscriptions (flexible params + idempotency)
  // -----------------------
  static async createTenantSubscription(tenantId, params = {}) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    const { idempotencyKey, priceId, ...rest } = params;
    const base = {
      ...rest,
      // spread first
      customer: customer.id,
      // then enforce correct customer
      items: rest.items || (priceId ? [{ price: priceId }] : void 0),
      metadata: rest.metadata || {}
    };
    const options = {};
    if (idempotencyKey) options.idempotencyKey = idempotencyKey;
    return await this.execute(
      () => this.stripe.subscriptions.create(base, options)
    );
  }
  static async updateTenantSubscription(subscriptionId, updateFields, idempotencyKey) {
    return await this.execute(
      () => this.stripe.subscriptions.update(
        subscriptionId,
        updateFields,
        idempotencyKey ? { idempotencyKey } : void 0
      )
    );
  }
  static async cancelTenantSubscription(subscriptionId, options = {
    atPeriodEnd: true
  }) {
    if (options.atPeriodEnd) {
      return await this.updateTenantSubscription(subscriptionId, {
        cancel_at_period_end: true
      });
    }
    return await this.execute(
      () => this.stripe.subscriptions.cancel(subscriptionId)
    );
  }
  static async listTenantSubscriptions(tenantId) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const subs = await this.execute(
      () => this.stripe.subscriptions.list({ customer: customer.id })
    );
    return subs.data;
  }
  // -----------------------
  // 💸 Payments / Invoices (fully param-driven)
  // -----------------------
  static async createOneTimeCharge(tenantId, params) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    if (params.amount !== void 0)
      params.amount = this.formatAmountToStripeCents(params.amount);
    const toSend = {
      customer: customer.id,
      currency: params.currency || this.defaultCurrency,
      payment_method_types: params.payment_method_types || this.defaultPaymentMethodTypes,
      ...params
    };
    const options = {};
    if (params.idempotencyKey)
      options.idempotencyKey = params.idempotencyKey;
    return await this.execute(
      () => this.stripe.paymentIntents.create(toSend, options)
    );
  }
  static async createInvoiceItem(tenantId, params) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    if (params.amount !== void 0)
      params.amount = this.formatAmountToStripeCents(params.amount);
    const toSend = {
      customer: customer.id,
      currency: params.currency || this.defaultCurrency,
      ...params
    };
    return await this.execute(() => this.stripe.invoiceItems.create(toSend));
  }
  static async createAndSendInvoice(tenantId, params = {}) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    const invoice = await this.execute(
      () => this.stripe.invoices.create({
        customer: customer.id,
        auto_advance: true,
        ...params
      })
    );
    if (!invoice.id) throw new Error("Invoice ID is undefined");
    await this.execute(() => this.stripe.invoices.sendInvoice(invoice.id));
    return invoice;
  }
  static async retrieveInvoices(tenantId) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const invoices = await this.execute(
      () => this.stripe.invoices.list({ customer: customer.id })
    );
    return invoices.data;
  }
  static getInvoiceUrl(invoiceId) {
    return `https://billing.stripe.com/invoices/${invoiceId}`;
  }
  // -----------------------
  // 💳 Payment Methods
  // -----------------------
  static async createPaymentMethod(params) {
    return await this.execute(() => this.stripe.paymentMethods.create(params));
  }
  static async attachPaymentMethodToTenant(tenantId, paymentMethodId, options = { setAsDefault: true }) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    const paymentMethod = await this.execute(
      () => this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id
      })
    );
    if (options.setAsDefault) {
      await this.execute(
        () => this.stripe.customers.update(customer.id, {
          invoice_settings: { default_payment_method: paymentMethodId }
        })
      );
    }
    return paymentMethod;
  }
  static async updatePaymentMethod(paymentMethodId, data) {
    return await this.execute(
      () => this.stripe.paymentMethods.update(paymentMethodId, data)
    );
  }
  static async detachPaymentMethod(paymentMethodId) {
    return await this.execute(
      () => this.stripe.paymentMethods.detach(paymentMethodId)
    );
  }
  static async listPaymentMethods(tenantId, type = "card") {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const paymentMethods = await this.execute(
      () => this.stripe.paymentMethods.list({ customer: customer.id, type })
    );
    return paymentMethods.data;
  }
  // -----------------------
  // 📥 Refunds
  // -----------------------
  static async refundCharge(chargeId, amount, idempotencyKey) {
    const params = { charge: chargeId };
    if (amount !== void 0)
      params.amount = this.formatAmountToStripeCents(amount);
    const options = {};
    if (idempotencyKey) options.idempotencyKey = idempotencyKey;
    return await this.execute(
      () => this.stripe.refunds.create(params, options)
    );
  }
  static async getRefunds(tenantId) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) return [];
    const charges = await this.execute(
      () => this.stripe.charges.list({ customer: customer.id })
    );
    return charges.data.flatMap((charge) => charge?.refunds?.data || []);
  }
  // -----------------------
  // 🌐 Billing Portal
  // -----------------------
  static async getBillingPortalSessionUrl(tenantId, returnUrl, params) {
    const customer = await this.getTenantCustomer(tenantId);
    if (!customer) throw new Error("Customer not found");
    const session2 = await this.execute(
      () => this.stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: returnUrl,
        ...params
      })
    );
    return session2.url;
  }
  // -----------------------
  // ⚙️ Helpers
  // -----------------------
  static formatAmountToStripeCents(amount) {
    return Math.round(amount * 100);
  }
  static convertStripeCentsToAmount(cents) {
    return cents / 100;
  }
  static getTenantIdFromMetadata(metadata) {
    return metadata ? metadata.tenantId || null : null;
  }
  static getStripeCustomerIdFromMetadata(metadata) {
    return metadata ? metadata.stripeCustomerId || null : null;
  }
  static logStripeError(error) {
    this.log("Stripe Error:", this.parseStripeError(error));
  }
  static parseStripeError(error) {
    if (!error) return "Unknown Stripe error";
    if (error.type && error.message) return `[${error.type}] ${error.message}`;
    if (error.raw && error.raw.message) return error.raw.message;
    return String(error);
  }
  static async retryWithBackoff(fn, retries = this.retryConfig.retries, delay = this.retryConfig.delayMs) {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      if (this.debug)
        this.log("retryWithBackoff: attempt failed, retrying", {
          retries,
          err
        });
      await new Promise((res) => setTimeout(res, delay));
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }
  static async execute(fn) {
    try {
      return await this.retryWithBackoff(
        fn,
        this.retryConfig.retries,
        this.retryConfig.delayMs
      );
    } catch (err) {
      this.logStripeError(err);
      throw err;
    }
  }
  // Convenience composite helper
  static async createCustomerAndSubscription(tenantId, customerParams, subscriptionParams) {
    const customer = await this.createTenantCustomer(tenantId, customerParams);
    const sub = await this.createTenantSubscription(tenantId, {
      ...subscriptionParams,
      customer: customer.id
    });
    return { customer, subscription: sub };
  }
  static log(...args) {
    try {
      this.logFn?.(...args);
    } catch (err) {
      console.info(...args);
    }
  }
};
StripeService.webhookHandlers = [];
StripeService.logFn = console.info;
StripeService.defaultCurrency = "usd";
StripeService.defaultPaymentMethodTypes = ["card"];
StripeService.retryConfig = { retries: 3, delayMs: 1e3 };
StripeService.debug = false;

// src/service/queue/rabbitmq/index.ts
var amqplib = __toESM(require("amqplib"), 1);
var _RabbitMQService_static, connect_fn2, reconnect_fn2, setupExchanges_fn, setupQueues_fn, setupConsumer_fn, reRegisterConsumers_fn;
var _RabbitMQService = class _RabbitMQService {
  static async init(config8) {
    var _a;
    if (_RabbitMQService.isInitialized || !config8?.enabled) return;
    console.log("I am trying to initialize the RabbitMQService");
    _RabbitMQService.enabled = true;
    _RabbitMQService.config = config8;
    _RabbitMQService.isInitialized = true;
    await __privateMethod(_a = _RabbitMQService, _RabbitMQService_static, connect_fn2).call(_a);
  }
  static getChannel() {
    if (!_RabbitMQService.channel)
      throw new Error("RabbitMQService not initialized");
    return _RabbitMQService.channel;
  }
  static async publishToExchange(exchange, routingKey, message) {
    if (!_RabbitMQService.channel)
      throw new Error("RabbitMQService not connected");
    const buffer = Buffer.from(JSON.stringify(message));
    _RabbitMQService.channel.publish(exchange, routingKey, buffer, {
      persistent: true
    });
  }
  static async publishToQueue(queue, message) {
    if (!_RabbitMQService.channel)
      throw new Error("RabbitMQService not connected");
    const buffer = Buffer.from(JSON.stringify(message));
    _RabbitMQService.channel.sendToQueue(queue, buffer, { persistent: true });
  }
  static async consume(queue, handler, options = {}) {
    var _a;
    _RabbitMQService.consumers.push({ queue, handler, options });
    if (!_RabbitMQService.channel) {
      console.warn(
        `[RabbitMQService] Consumer for "${queue}" registered before initialization. Will activate after connection.`
      );
      return;
    }
    await __privateMethod(_a = _RabbitMQService, _RabbitMQService_static, setupConsumer_fn).call(_a, queue, handler, options);
  }
};
_RabbitMQService_static = new WeakSet();
connect_fn2 = async function() {
  var _a, _b, _c, _d;
  try {
    if (!_RabbitMQService.config) throw new Error("Config not set");
    _RabbitMQService.connection = await amqplib.connect(
      _RabbitMQService.config.uri
    );
    _RabbitMQService.connection?.on("error", (err) => {
      var _a2;
      console.error("[RabbitMQService] Connection error event:", err);
      __privateMethod(_a2 = _RabbitMQService, _RabbitMQService_static, reconnect_fn2).call(_a2);
    });
    _RabbitMQService.connection?.on("close", () => {
      var _a2;
      console.warn("[RabbitMQService] Connection closed, reconnecting...");
      __privateMethod(_a2 = _RabbitMQService, _RabbitMQService_static, reconnect_fn2).call(_a2);
    });
    _RabbitMQService.channel = await _RabbitMQService.connection?.createChannel();
    if (_RabbitMQService.config.prefetch && _RabbitMQService.channel) {
      _RabbitMQService.channel.prefetch(_RabbitMQService.config.prefetch);
    }
    await __privateMethod(_a = _RabbitMQService, _RabbitMQService_static, setupExchanges_fn).call(_a);
    await __privateMethod(_b = _RabbitMQService, _RabbitMQService_static, setupQueues_fn).call(_b);
    await __privateMethod(_c = _RabbitMQService, _RabbitMQService_static, reRegisterConsumers_fn).call(_c);
    console.log("[RabbitMQService] Connected and configured.");
  } catch (err) {
    console.error("[RabbitMQService] Connection error:", err);
    __privateMethod(_d = _RabbitMQService, _RabbitMQService_static, reconnect_fn2).call(_d);
  }
};
reconnect_fn2 = async function() {
  console.warn("[RabbitMQService] Reconnecting in 5s...");
  setTimeout(() => {
    var _a;
    return __privateMethod(_a = _RabbitMQService, _RabbitMQService_static, connect_fn2).call(_a);
  }, 5e3);
};
setupExchanges_fn = async function() {
  if (!_RabbitMQService.config?.exchanges || !_RabbitMQService.channel) return;
  for (const ex of _RabbitMQService.config.exchanges) {
    await _RabbitMQService.channel.assertExchange(
      ex.name,
      ex.type,
      ex.options || {}
    );
  }
};
setupQueues_fn = async function() {
  if (!_RabbitMQService.config?.queues || !_RabbitMQService.channel) return;
  for (const q of _RabbitMQService.config.queues) {
    const options = q.options || {};
    if (q.deadLetter) {
      await _RabbitMQService.channel.assertExchange(
        `${q.name}.dlx`,
        "fanout",
        { durable: true }
      );
      await _RabbitMQService.channel.assertQueue(`${q.name}.dlq`, {
        durable: true
      });
      await _RabbitMQService.channel.bindQueue(
        `${q.name}.dlq`,
        `${q.name}.dlx`,
        ""
      );
      options.deadLetterExchange = `${q.name}.dlx`;
    }
    await _RabbitMQService.channel.assertQueue(q.name, options);
    if (q.bindTo) {
      await _RabbitMQService.channel.bindQueue(
        q.name,
        q.bindTo.exchange,
        q.bindTo.routingKey || ""
      );
    }
  }
};
setupConsumer_fn = async function(queue, handler, options = {}) {
  const retryLimit = options.retryAttempts ?? 3;
  const retryDelay = options.retryDelayMs ?? 1e3;
  const channel = _RabbitMQService.getChannel();
  await channel.consume(queue, async (msg) => {
    if (!msg) return;
    const content = JSON.parse(msg.content.toString());
    let attempts = 0;
    const attempt = async () => {
      try {
        await handler(content);
        channel.ack(msg);
      } catch (err) {
        attempts++;
        if (attempts <= retryLimit) {
          console.warn(
            `[RabbitMQService] Retry attempt ${attempts} for queue "${queue}"`
          );
          setTimeout(attempt, retryDelay);
        } else {
          console.error(
            `[RabbitMQService] Failed after ${retryLimit} attempts for queue "${queue}"`,
            err
          );
          channel.nack(msg, false, false);
        }
      }
    };
    attempt();
  });
};
reRegisterConsumers_fn = async function() {
  var _a;
  if (!_RabbitMQService.consumers.length) return;
  console.log("[RabbitMQService] Re-registering consumers...");
  for (const { queue, handler, options } of _RabbitMQService.consumers) {
    try {
      await __privateMethod(_a = _RabbitMQService, _RabbitMQService_static, setupConsumer_fn).call(_a, queue, handler, options);
    } catch (err) {
      console.error(
        `[RabbitMQService] Error re-registering consumer for queue "${queue}"`,
        err
      );
    }
  }
};
__privateAdd(_RabbitMQService, _RabbitMQService_static);
_RabbitMQService.enabled = false;
_RabbitMQService.config = null;
_RabbitMQService.connection = null;
_RabbitMQService.channel = null;
_RabbitMQService.isInitialized = false;
_RabbitMQService.consumers = [];
var RabbitMQService = _RabbitMQService;

// src/service/scheduler/cron/index.ts
var import_node_cron = require("node-cron");
var import_redlock = __toESM(require("redlock"), 1);
var import_axios = __toESM(require("axios"), 1);
var import_date_fns = require("date-fns");
var import_crypto = require("crypto");
var CronManager = class {
  constructor({
    serviceName,
    redis,
    persistent,
    timezone,
    persistService,
    mongoClient
  }) {
    this.serviceName = serviceName;
    this.logger = logger || console;
    this.redis = redis || RedisClientService.getClient() || null;
    this.persistent = persistent;
    this.timezone = timezone;
    this.persistService = persistService;
    this.mongoClient = mongoClient;
    this.jobs = /* @__PURE__ */ new Map();
    if (this.persistent && this.persistService === "redis") {
      this.redlock = new import_redlock.default([this.redis], {
        retryCount: 3,
        retryDelay: 200,
        retryJitter: 200
      });
      this.restoreJobsFromRedis();
    } else if (this.persistent && this.persistService === "mongodb") {
      this.db = mongoClient;
      this.restoreJobsFromMongo();
    }
  }
  generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = (0, import_crypto.randomBytes)(6).toString("base64");
    return `${timestamp}-${randomString}`;
  }
  async trackJobState(jobName, state) {
    const timestamp = (0, import_date_fns.format)(/* @__PURE__ */ new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
    if (this.persistent && this.persistService === "redis") {
      await this.redis.hset(
        `cron:${this.serviceName}:jobStates`,
        jobName,
        JSON.stringify({ state, timestamp })
      );
    } else if (this.persistent && this.persistService === "mongodb") {
      await this.db.collection(`cron_${this.serviceName}_jobStates`).updateOne(
        { jobName },
        { $set: { state, timestamp } },
        { upsert: true }
      );
    }
  }
  async getJobState(jobName) {
    if (this.persistent && this.persistService === "redis") {
      const jobState = await this.redis.hget(
        `cron:${this.serviceName}:jobStates`,
        jobName
      );
      return jobState ? JSON.parse(jobState) : null;
    } else if (this.persistent && this.persistService === "mongodb") {
      return await this.db.collection(`cron_${this.serviceName}_jobStates`).findOne({ jobName }).setOptions({ skipTenantCheck: true });
    }
    return null;
  }
  async saveJobDefinition(name, cronExpression, apiConfig, options = {}) {
    const jobData = { name, cronExpression, apiConfig, options };
    if (this.persistent && this.persistService === "redis") {
      await this.redis.hset(
        `cron:${this.serviceName}:jobDefs`,
        name,
        JSON.stringify(jobData)
      );
    } else if (this.persistent && this.persistService === "mongodb") {
      await this.db.collection(`cron_${this.serviceName}_jobDefs`).updateOne({ name }, { $set: jobData }, { upsert: true });
    }
  }
  async restoreJobsFromRedis() {
    const jobDefs = await this.redis.hgetall(
      `cron:${this.serviceName}:jobDefs`
    );
    for (const [jobName, jobDataString] of Object.entries(jobDefs)) {
      const jobData = JSON.parse(jobDataString);
      if (this.jobs.has(jobData.name)) continue;
      this.registerJob(
        jobData.name,
        jobData.cronExpression,
        jobData.apiConfig,
        jobData.options
      );
    }
  }
  async restoreJobsFromMongo() {
    const jobDefs = await this.db.collection(`cron_${this.serviceName}_jobDefs`).find({}).toArray();
    for (const jobData of jobDefs) {
      if (this.jobs.has(jobData.name)) continue;
      this.registerJob(
        jobData.name,
        jobData.cronExpression,
        jobData.apiConfig,
        jobData.options
      );
    }
  }
  registerJob(name, cronExpression, apiConfig, options = {}) {
    if (this.jobs.has(name)) {
      this.logger.warn(`Job "${name}" is already registered.`);
      return;
    }
    const { runOnInit = false, retry = 0, lockTimeout = 6e4 } = options;
    const job = {
      name,
      cronExpression,
      apiConfig,
      options,
      scheduledTask: null,
      state: "pending"
    };
    const executeTask = async () => {
      if (job.state === "paused") {
        this.logger.info(`Job "${name}" skipped because it is paused.`);
        return;
      }
      const lockKey = `locks:${this.serviceName}:${name}`;
      let lock;
      try {
        if (this.redlock) {
          lock = await this.redlock.acquire([lockKey], lockTimeout);
        }
        let attempts = 0;
        while (attempts <= retry) {
          try {
            await this.trackJobState(name, "running");
            const response = await (0, import_axios.default)({
              method: apiConfig.method,
              url: apiConfig.url,
              headers: apiConfig.headers || {},
              data: apiConfig.data || {},
              params: apiConfig.params || {},
              timeout: apiConfig.timeout || 1e4
            });
            await this.trackJobState(name, "success");
            this.logger.info(`Job "${name}" executed: ${response.status}`);
            break;
          } catch (err) {
            attempts++;
            await this.trackJobState(name, "failed");
            this.logger.error(
              `Job "${name}" failed attempt ${attempts}: ${err.message}`
            );
            if (attempts > retry) {
              this.logger.error(`Job "${name}" failed after ${retry} retries.`);
            }
          }
        }
      } catch (lockError) {
        this.logger.warn(
          `Job "${name}" skipped due to lock acquisition failure.`
        );
      } finally {
        if (lock) {
          try {
            await lock.release();
          } catch (releaseError) {
            this.logger.error(
              `Failed to release lock for job "${name}": ${releaseError.message}`
            );
          }
        }
      }
    };
    const scheduledTask = (0, import_node_cron.schedule)(cronExpression, executeTask, {
      scheduled: true,
      timezone: this.timezone
    });
    job.scheduledTask = scheduledTask;
    this.jobs.set(name, job);
    this.saveJobDefinition(name, cronExpression, apiConfig, options);
    if (runOnInit) executeTask();
    this.logger.info(
      `Job "${name}" registered to call "${apiConfig.url}" on schedule "${cronExpression}".`
    );
  }
  pauseJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;
    job.state = "paused";
    this.trackJobState(name, "paused");
    this.logger.info(`Job "${name}" paused.`);
  }
  resumeJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;
    job.state = "running";
    this.trackJobState(name, "running");
    this.logger.info(`Job "${name}" resumed.`);
  }
  stopJob(name) {
    const job = this.jobs.get(name);
    if (!job || !job.scheduledTask?.running) return;
    job.scheduledTask.stop();
    job.state = "stopped";
    this.trackJobState(name, "stopped");
    this.logger.info(`Job "${name}" stopped.`);
  }
  async removeJob(name) {
    const job = this.jobs.get(name);
    if (!job) return;
    job.scheduledTask?.destroy();
    this.jobs.delete(name);
    if (this.persistent) {
      if (this.persistService === "redis") {
        await this.redis.hdel(`cron:${this.serviceName}:jobStates`, name);
        await this.redis.hdel(`cron:${this.serviceName}:jobDefs`, name);
      } else if (this.persistService === "mongodb") {
        await this.db.collection(`cron_${this.serviceName}_jobStates`).deleteOne({ jobName: name });
        await this.db.collection(`cron_${this.serviceName}_jobDefs`).deleteOne({ name });
      }
    }
    this.logger.info(`Job "${name}" removed.`);
  }
  listJobs() {
    return Array.from(this.jobs.keys());
  }
};

// src/service/storage/s3/index.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
var _S3Service = class _S3Service {
  static init(config8) {
    if (!_S3Service.s3) {
      _S3Service.s3 = new import_client_s3.S3Client({
        region: config8.region || process?.env?.AWS_S3_REGION,
        credentials: {
          accessKeyId: config8.accessKeyId || process?.env?.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: config8.secretAccessKey || process?.env?.AWS_S3_SECRET_ACCESS_KEY
        }
      });
    }
  }
  static async uploadFile(params) {
    if (!_S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new import_client_s3.PutObjectCommand(params);
    try {
      const response = await _S3Service.s3.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
  static async getPresignedUrl(params) {
    if (!_S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const { Bucket, Key, expiresIn = 3600 } = params;
    const command = new import_client_s3.GetObjectCommand({ Bucket, Key });
    try {
      const url = await (0, import_s3_request_presigner.getSignedUrl)(_S3Service.s3, command, { expiresIn });
      return url;
    } catch (error) {
      throw new Error(`Error generating presigned URL: ${error.message}`);
    }
  }
  static async deleteFile(params) {
    if (!_S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new import_client_s3.DeleteObjectCommand(params);
    try {
      const response = await _S3Service.s3.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
};
_S3Service.s3 = null;
var S3Service = _S3Service;

// src/third-party/axios/index.ts
var import_axios2 = __toESM(require("axios"), 1);
var _AxiosHelper = class _AxiosHelper {
  constructor(config8) {
    if (_AxiosHelper.instance) {
      return _AxiosHelper.instance;
    }
    if (!config8.baseURL) {
      throw new Error("Base URL is required to create Axios instance");
    }
    this.baseURL = config8.baseURL;
    this.timeout = config8.timeout ?? 5e3;
    this.headers = config8.headers ?? {};
    this.axiosInstance = import_axios2.default.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        ...this.headers
      }
    });
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
    _AxiosHelper.instance = this;
  }
  static getInstance(config8) {
    if (!_AxiosHelper.instance) {
      _AxiosHelper.instance = new _AxiosHelper(config8);
    }
    return _AxiosHelper.instance;
  }
  handleResponse(response) {
    return response;
  }
  handleError(error) {
    if (error.response) {
      console.error("Server error:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Axios setup error:", error.message);
    }
    return Promise.reject(error);
  }
  async request(method, options) {
    const { url, data, headers = {}, params = {}, config: config8 = {} } = options;
    try {
      const finalConfig = {
        method,
        url,
        headers: { ...this.headers, ...headers },
        params,
        ...config8
      };
      if (["post", "put", "patch", "delete"].includes(method.toLowerCase()) && data !== void 0) {
        finalConfig.data = data;
      }
      const response = await this.axiosInstance.request(finalConfig);
      return response.data;
    } catch (error) {
      throw new Error(
        `${method.toUpperCase()} request failed: ${error.message}`
      );
    }
  }
  async get(options) {
    return this.request("get", options);
  }
  async post(options) {
    return this.request("post", options);
  }
  async put(options) {
    return this.request("put", options);
  }
  async patch(options) {
    return this.request("patch", options);
  }
  async delete(options) {
    return this.request("delete", options);
  }
};
_AxiosHelper.instance = null;
var AxiosHelper = _AxiosHelper;

// src/third-party/zod/index.ts
var z2 = __toESM(require("zod"), 1);

// src/util/date/business/index.ts
var import_date_fns2 = require("date-fns");
var DateUtilBusiness = class {
  static isBusinessDay(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const day = (0, import_date_fns2.getDay)(date);
      return day !== 0 && day !== 6;
    } catch (error) {
      console.error(`Error in isBusinessDay method: ${error.message}`);
      return false;
    }
  }
  static nextBusinessDay(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      let nextDay = (0, import_date_fns2.addDays)(date, 1);
      while (!this.isBusinessDay(nextDay)) {
        nextDay = (0, import_date_fns2.addDays)(nextDay, 1);
      }
      return nextDay;
    } catch (error) {
      console.error(`Error in nextBusinessDay method: ${error.message}`);
      return null;
    }
  }
  static getNthWeekdayInMonth(n, weekday, month, year) {
    try {
      if (typeof n !== "number" || n <= 0) {
        throw new Error("n must be a positive integer.");
      }
      if (typeof weekday !== "number" || weekday < 0 || weekday > 6) {
        throw new Error("weekday must be a number between 0 and 6.");
      }
      if (typeof month !== "number" || month < 0 || month > 11) {
        throw new Error("month must be between 0 and 11.");
      }
      if (typeof year !== "number") {
        throw new Error("year must be a valid number.");
      }
      let firstDay = new Date(year, month, 1);
      let firstDayWeekday = (0, import_date_fns2.getDay)(firstDay);
      let daysToAdd = (weekday + 7 - firstDayWeekday) % 7;
      firstDay = (0, import_date_fns2.addDays)(firstDay, daysToAdd);
      return (0, import_date_fns2.addDays)(firstDay, 7 * (n - 1));
    } catch (error) {
      console.error(`Error in getNthWeekdayInMonth method: ${error.message}`);
      return null;
    }
  }
  static isHoliday(date, holidayList) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (!Array.isArray(holidayList)) {
        throw new Error("holidayList must be an array of Date objects.");
      }
      return holidayList.some(
        (holiday) => holiday.getTime() === date.getTime()
      );
    } catch (error) {
      console.error(`Error in isHoliday method: ${error.message}`);
      return false;
    }
  }
  static addBusinessDays(date, n) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof n !== "number" || n === 0) {
        throw new Error("n must be a valid number.");
      }
      let currentDate = date;
      let addedDays = 0;
      while (addedDays < Math.abs(n)) {
        currentDate = (0, import_date_fns2.addDays)(currentDate, n > 0 ? 1 : -1);
        if (this.isBusinessDay(currentDate)) {
          addedDays++;
        }
      }
      return currentDate;
    } catch (error) {
      console.error(`Error in addBusinessDays method: ${error.message}`);
      return null;
    }
  }
};

// src/util/date/compare/index.ts
var import_date_fns3 = require("date-fns");
var DateUtilCompare = class {
  static isBefore(date, otherDate, unit) {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);
      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }
      return (0, import_date_fns3.isBefore)(dateCopy, otherDateCopy);
    }
    return (0, import_date_fns3.isBefore)(date, otherDate);
  }
  static isAfter(date, otherDate, unit) {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);
      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }
      return (0, import_date_fns3.isAfter)(dateCopy, otherDateCopy);
    }
    return (0, import_date_fns3.isAfter)(date, otherDate);
  }
  static isSame(date, otherDate, unit) {
    if (unit) {
      const dateCopy = new Date(date);
      const otherDateCopy = new Date(otherDate);
      switch (unit) {
        case "second":
          dateCopy.setMilliseconds(0);
          otherDateCopy.setMilliseconds(0);
          break;
        case "minute":
          dateCopy.setSeconds(0, 0);
          otherDateCopy.setSeconds(0, 0);
          break;
        case "hour":
          dateCopy.setMinutes(0, 0, 0);
          otherDateCopy.setMinutes(0, 0, 0);
          break;
        case "day":
          dateCopy.setHours(0, 0, 0, 0);
          otherDateCopy.setHours(0, 0, 0, 0);
          break;
        case "month":
          dateCopy.setDate(1);
          otherDateCopy.setDate(1);
          break;
        case "year":
          dateCopy.setMonth(0, 1);
          otherDateCopy.setMonth(0, 1);
          break;
      }
      return (0, import_date_fns3.isEqual)(dateCopy, otherDateCopy);
    }
    return (0, import_date_fns3.isEqual)(date, otherDate);
  }
  static compare(date, otherDate) {
    return (0, import_date_fns3.compareAsc)(date, otherDate);
  }
  static isBetween(date, start, end) {
    return (0, import_date_fns3.isWithinInterval)(date, { start, end });
  }
};

// src/util/date/create/index.ts
var import_date_fns4 = require("date-fns");
var import_date_fns_tz = require("date-fns-tz");
var DateUtilCreate = class {
  /**
   * Create a date with value, format, and optional timezone
   */
  static create({
    value,
    format: dateFormat,
    timezone = "UTC"
  }) {
    if (!value) return null;
    if (dateFormat) {
      const parsedDate = (0, import_date_fns4.parse)(value, dateFormat, /* @__PURE__ */ new Date());
      return (0, import_date_fns4.isValid)(parsedDate) ? (0, import_date_fns_tz.toZonedTime)(parsedDate, timezone) : null;
    }
    const date = new Date(value);
    return (0, import_date_fns4.isValid)(date) ? (0, import_date_fns_tz.toZonedTime)(date, timezone) : null;
  }
  /**
   * Return current timestamp with timezone
   */
  static now(timezone = "UTC") {
    return (0, import_date_fns_tz.toZonedTime)(/* @__PURE__ */ new Date(), timezone);
  }
  /**
   * Create from Unix timestamp (in seconds or milliseconds)
   */
  static fromUnix(unixTimestamp, timezone = "UTC") {
    const ts = unixTimestamp.toString().length === 10 ? unixTimestamp * 1e3 : unixTimestamp;
    return (0, import_date_fns_tz.toZonedTime)((0, import_date_fns4.fromUnixTime)(ts / 1e3), timezone);
  }
  /**
   * Create from ISO string
   */
  static fromISOString(isoString, timezone = "UTC") {
    return (0, import_date_fns_tz.toZonedTime)(new Date(isoString), timezone);
  }
  /**
   * Construct date from parts
   */
  static fromParts({
    year,
    month,
    day,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    timezone = "UTC"
  }) {
    const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      millisecond
    );
    return (0, import_date_fns_tz.toZonedTime)(date, timezone);
  }
};

// src/util/date/duration/index.ts
var import_date_fns5 = require("date-fns");
var DateUtilDuration = class {
  static diff(date1, date2, unit, float = false) {
    try {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        throw new Error("Both inputs must be valid Date objects.");
      }
      let diff;
      switch (unit) {
        case "milliseconds":
          diff = (0, import_date_fns5.differenceInMilliseconds)(date1, date2);
          break;
        case "seconds":
          diff = (0, import_date_fns5.differenceInSeconds)(date1, date2);
          break;
        case "minutes":
          diff = (0, import_date_fns5.differenceInMinutes)(date1, date2);
          break;
        case "hours":
          diff = (0, import_date_fns5.differenceInHours)(date1, date2);
          break;
        case "days":
          diff = (0, import_date_fns5.differenceInDays)(date1, date2);
          break;
        case "weeks":
          diff = (0, import_date_fns5.differenceInWeeks)(date1, date2);
          break;
        case "months":
          diff = (0, import_date_fns5.differenceInMonths)(date1, date2);
          break;
        case "years":
          diff = (0, import_date_fns5.differenceInYears)(date1, date2);
          break;
        default:
          throw new Error("Invalid unit provided.");
      }
      return float ? diff : Math.floor(diff);
    } catch (error) {
      console.error(`Error in diff method: ${error.message}`);
      return null;
    }
  }
  static duration(from, to) {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }
      const diffInMs = Math.abs(to.getTime() - from.getTime());
      const days = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(
        diffInMs % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
      );
      const minutes = Math.floor(diffInMs % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diffInMs % (1e3 * 60) / 1e3);
      return { days, hours, minutes, seconds };
    } catch (error) {
      console.error(`Error in duration method: ${error.message}`);
      return null;
    }
  }
  static fromNow(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      return (0, import_date_fns5.formatDistanceToNow)(date, { addSuffix: true });
    } catch (error) {
      console.error(`Error in fromNow method: ${error.message}`);
      return null;
    }
  }
  static countWeekdays(from, to) {
    try {
      if (!(from instanceof Date) || !(to instanceof Date)) {
        throw new Error("Both from and to must be valid Date objects.");
      }
      const weekdays = (0, import_date_fns5.eachDayOfInterval)({ start: from, end: to }).filter(
        (date) => {
          const day = date.getDay();
          return day !== 0 && day !== 6;
        }
      );
      return weekdays.length;
    } catch (error) {
      console.error(`Error in countWeekdays method: ${error.message}`);
      return null;
    }
  }
};

// src/util/date/edge-case/index.ts
var import_date_fns6 = require("date-fns");
var DateUtilEdgeCase = class {
  static handleInvalidFallback(date, fallback) {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return (0, import_date_fns6.isValid)(d) ? d : fallback;
    } catch (error) {
      console.error(
        `Error in handleInvalidFallback method: ${error instanceof Error ? error.message : error}`
      );
      return null;
    }
  }
  static normalizeDateInput(input) {
    try {
      const date = input instanceof Date ? input : new Date(input);
      return (0, import_date_fns6.isValid)(date) ? date : null;
    } catch (error) {
      console.error(
        `Error in normalizeDateInput method: ${error instanceof Error ? error.message : error}`
      );
      return null;
    }
  }
  static getMaxDate(...dates) {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && (0, import_date_fns6.isValid)(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return (0, import_date_fns6.max)(validDates);
    } catch (error) {
      console.error(
        `Error in getMaxDate method: ${error instanceof Error ? error.message : error}`
      );
      return null;
    }
  }
  static getMinDate(...dates) {
    try {
      const validDates = dates.filter(
        (date) => date instanceof Date && (0, import_date_fns6.isValid)(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return (0, import_date_fns6.min)(validDates);
    } catch (error) {
      console.error(
        `Error in getMinDate method: ${error instanceof Error ? error.message : error}`
      );
      return null;
    }
  }
  static isAmbiguousDST(date) {
    try {
      const oneMinuteLater = new Date(date.getTime() + 60 * 1e3);
      const offsetNow = date.getTimezoneOffset();
      const offsetLater = oneMinuteLater.getTimezoneOffset();
      return offsetNow !== offsetLater && offsetNow > offsetLater;
    } catch (error) {
      console.error(
        `Error in isAmbiguousDST method: ${error instanceof Error ? error.message : error}`
      );
      return false;
    }
  }
};

// src/util/date/format/index.ts
var import_date_fns7 = require("date-fns");
var DateUtilFormat = class {
  /**
   * Format date using a custom format string
   */
  static formatDate(date, formatStr) {
    return (0, import_date_fns7.format)(date, formatStr);
  }
  /**
   * Return ISO string from Date object
   */
  static toISOString(date) {
    return date.toISOString();
  }
  /**
   * Return Unix timestamp from Date object
   */
  static toUnix(date) {
    return Math.floor(date.getTime() / 1e3);
  }
  /**
   * Convert Date object to JSON string
   */
  static toJSON(date) {
    return date.toJSON();
  }
  /**
   * Convert Date object to locale string with options
   */
  static toLocaleString(date, locale = "en-US", opts = {}) {
    return date.toLocaleString(locale, opts);
  }
  /**
   * Return timezone offset string like +05:30 or -04:00
   */
  static getOffset(date) {
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.abs(Math.floor(offset / 60))).padStart(2, "0");
    const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
};

// src/util/date/manipulate/index.ts
var import_date_fns8 = require("date-fns");
var addMap = {
  days: import_date_fns8.addDays,
  months: import_date_fns8.addMonths,
  years: import_date_fns8.addYears,
  weeks: import_date_fns8.addWeeks,
  hours: import_date_fns8.addHours,
  minutes: import_date_fns8.addMinutes,
  seconds: import_date_fns8.addSeconds
};
var subMap = {
  days: import_date_fns8.subDays,
  months: import_date_fns8.subMonths,
  years: import_date_fns8.subYears,
  weeks: import_date_fns8.subWeeks,
  hours: import_date_fns8.subHours,
  minutes: import_date_fns8.subMinutes,
  seconds: import_date_fns8.subSeconds
};
var setMap = {
  year: import_date_fns8.setYear,
  month: import_date_fns8.setMonth,
  day: import_date_fns8.setDate,
  hour: import_date_fns8.setHours,
  minute: import_date_fns8.setMinutes,
  second: import_date_fns8.setSeconds
};
var startMap = {
  day: import_date_fns8.startOfDay,
  month: import_date_fns8.startOfMonth,
  week: import_date_fns8.startOfWeek,
  year: import_date_fns8.startOfYear
};
var endMap = {
  day: import_date_fns8.endOfDay,
  month: import_date_fns8.endOfMonth,
  week: import_date_fns8.endOfWeek,
  year: import_date_fns8.endOfYear
};
var DateUtilManipulate = class {
  static add(date, value, unit) {
    try {
      const fn = addMap[unit];
      return fn(date, value);
    } catch (error) {
      console.error(`Error in add: ${error.message}`);
      return null;
    }
  }
  static subtract(date, value, unit) {
    try {
      const fn = subMap[unit];
      return fn(date, value);
    } catch (error) {
      console.error(`Error in subtract: ${error.message}`);
      return null;
    }
  }
  static set(date, unit, value) {
    try {
      const fn = setMap[unit];
      return fn(date, value);
    } catch (error) {
      console.error(`Error in set: ${error.message}`);
      return null;
    }
  }
  static startOf(date, unit) {
    try {
      const fn = startMap[unit];
      return fn(date);
    } catch (error) {
      console.error(`Error in startOf: ${error.message}`);
      return null;
    }
  }
  static endOf(date, unit) {
    try {
      const fn = endMap[unit];
      return fn(date);
    } catch (error) {
      console.error(`Error in endOf: ${error.message}`);
      return null;
    }
  }
  static clone(date) {
    try {
      if (!(date instanceof Date)) throw new Error("Invalid Date object.");
      return new Date(date.getTime());
    } catch (error) {
      console.error(`Error in clone: ${error.message}`);
      return null;
    }
  }
};

// src/util/date/range/index.ts
var import_date_fns9 = require("date-fns");
var DateUtilsRange = class {
  /**
   * Get all dates in a range from start date to end date
   */
  static getDateRange(start, end) {
    try {
      if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error("start and end must be valid Date objects.");
      }
      return (0, import_date_fns9.eachDayOfInterval)({ start, end });
    } catch (error) {
      console.error(`Error in getDateRange method: ${error.message}`);
      return [];
    }
  }
  /**
   * Chunk a range of dates into periods by the specified unit (e.g., days, weeks, months)
   */
  static chunkBy(dateRange, unit) {
    try {
      if (!Array.isArray(dateRange)) {
        throw new Error("dateRange must be an array of Date objects.");
      }
      if (typeof unit !== "string" || !["day", "week", "month"].includes(unit)) {
        throw new Error('unit must be one of: "day", "week", or "month".');
      }
      if (unit === "day") {
        return dateRange.map((date) => [date]);
      }
      if (unit === "week") {
        const weeks = [];
        let startOfWeekDate = (0, import_date_fns9.startOfWeek)(dateRange[0]);
        let endOfWeekDate = (0, import_date_fns9.endOfWeek)(dateRange[0]);
        while (startOfWeekDate <= dateRange[dateRange.length - 1]) {
          const weekRange = (0, import_date_fns9.eachDayOfInterval)({
            start: startOfWeekDate,
            end: endOfWeekDate
          });
          weeks.push(weekRange);
          startOfWeekDate = (0, import_date_fns9.addDays)(startOfWeekDate, 7);
          endOfWeekDate = (0, import_date_fns9.addDays)(endOfWeekDate, 7);
        }
        return weeks;
      }
      if (unit === "month") {
        const months = [];
        const monthRange = (0, import_date_fns9.eachMonthOfInterval)({
          start: dateRange[0],
          end: dateRange[dateRange.length - 1]
        });
        for (let i = 0; i < monthRange.length; i++) {
          months.push(
            (0, import_date_fns9.eachDayOfInterval)({
              start: monthRange[i],
              end: (0, import_date_fns9.addDays)(
                monthRange[i],
                (0, import_date_fns9.differenceInCalendarDays)(monthRange[i], monthRange[i + 1]) - 1
              )
            })
          );
        }
        return months;
      }
      return [];
    } catch (error) {
      console.error(`Error in chunkBy method: ${error.message}`);
      return [];
    }
  }
  /**
   * Check if two date ranges intersect (i.e., overlap)
   */
  static intersectRanges(r1, r2) {
    try {
      if (!Array.isArray(r1) || !Array.isArray(r2) || r1.length !== 2 || r2.length !== 2) {
        throw new Error(
          "Both date ranges must be arrays containing two Date objects."
        );
      }
      const [start1, end1] = r1;
      const [start2, end2] = r2;
      if (!(start1 instanceof Date) || !(end1 instanceof Date) || !(start2 instanceof Date) || !(end2 instanceof Date)) {
        throw new Error(
          "All elements of the date ranges must be valid Date objects."
        );
      }
      return (0, import_date_fns9.isWithinInterval)(start1, { start: start2, end: end2 }) || (0, import_date_fns9.isWithinInterval)(end1, { start: start2, end: end2 }) || (0, import_date_fns9.isWithinInterval)(start2, { start: start1, end: end1 }) || (0, import_date_fns9.isWithinInterval)(end2, { start: start1, end: end1 });
    } catch (error) {
      console.error(`Error in intersectRanges method: ${error.message}`);
      return false;
    }
  }
  /**
   * Merge multiple date ranges, ensuring no overlaps remain
   */
  static mergeRanges(ranges) {
    try {
      if (!Array.isArray(ranges)) {
        throw new Error("ranges must be an array of date range arrays.");
      }
      ranges.sort((a, b) => a[0].getTime() - b[0].getTime());
      const mergedRanges = [];
      let currentRange = ranges[0];
      for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];
        if (nextRange[0] <= currentRange[1]) {
          currentRange[1] = nextRange[1] > currentRange[1] ? nextRange[1] : currentRange[1];
        } else {
          mergedRanges.push(currentRange);
          currentRange = nextRange;
        }
      }
      mergedRanges.push(currentRange);
      return mergedRanges;
    } catch (error) {
      console.error(`Error in mergeRanges method: ${error.message}`);
      return [];
    }
  }
};

// src/util/date/timezone/index.ts
var import_date_fns_tz2 = require("date-fns-tz");
var import_date_fns10 = require("date-fns");
var DateUtilTimezone = class {
  static convertToTZ(date, timezone) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof timezone !== "string") {
        throw new Error("Timezone must be a valid string.");
      }
      const zonedDate = (0, import_date_fns_tz2.toZonedTime)(date, timezone);
      return zonedDate;
    } catch (error) {
      console.error(`Error in convertToTZ method: ${error.message}`);
      return null;
    }
  }
  static getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error(`Error in getTimezone method: ${error.message}`);
      return null;
    }
  }
  static withLocale(date, locale) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof locale !== "string") {
        throw new Error("Locale must be a valid string.");
      }
      return (0, import_date_fns10.format)(date, "P", { locale: new Intl.Locale(locale) });
    } catch (error) {
      console.error(`Error in withLocale method: ${error.message}`);
      return null;
    }
  }
  static getTimezoneAbbr(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const timeZoneAbbr = date.toLocaleString("en-US", { timeZoneName: "short" }).split(" ")[2];
      return timeZoneAbbr;
    } catch (error) {
      console.error(`Error in getTimezoneAbbr method: ${error.message}`);
      return null;
    }
  }
  static getTimezoneOffsetMinutes(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const offset = date.getTimezoneOffset();
      return -offset;
    } catch (error) {
      console.error(
        `Error in getTimezoneOffsetMinutes method: ${error.message}`
      );
      return null;
    }
  }
};

// src/util/date/validate/index.ts
var import_date_fns11 = require("date-fns");
var DateUtilValidate = class {
  static isValid(date) {
    return (0, import_date_fns11.isValid)(date);
  }
  static parseDate(str, formats = []) {
    let parsedDate = null;
    for (const format4 of formats) {
      parsedDate = (0, import_date_fns11.parse)(str, format4, /* @__PURE__ */ new Date());
      if ((0, import_date_fns11.isValid)(parsedDate)) {
        break;
      }
    }
    return parsedDate;
  }
  static isLeapYear(year) {
    return (0, import_date_fns11.isLeapYear)(new Date(year, 0, 1));
  }
  static isDST(date) {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }
  static isWeekend(date) {
    return (0, import_date_fns11.isWeekend)(date);
  }
  static isSameDay(date1, date2) {
    return (0, import_date_fns11.isSameDay)(date1, date2);
  }
};

// src/util/i18n/index.ts
var import_i18next = __toESM(require("i18next"), 1);
var config7 = {};
var initialized = false;
var i18n = {
  async init({ config: configObj, locales }) {
    if (initialized) return;
    config7 = configObj;
    await import_i18next.default.init({
      lng: "en",
      fallbackLng: "en",
      resources: locales,
      interpolation: { escapeValue: false }
    });
    initialized = true;
  },
  getMessage(locale, key) {
    return import_i18next.default.t(key, { lng: locale });
  },
  getConfig(code) {
    return config7[code] || {};
  }
};

// src/util/response/index.ts
var ResponseUtil = class {
};
ResponseUtil.send = (req, res, code, data = {}) => {
  if (res.headersSent) return;
  if (!code)
    throw new Error('ResponseUtil.send: "code" parameter is required.');
  const config8 = i18n.getConfig(code);
  const message = i18n.getMessage(res.locale || "en", code);
  const body = {
    success: config8?.success,
    code: config8?.code,
    ...Object?.keys(data)?.length ? { data } : {},
    ...message && { message },
    ...req.requestId && { requestId: req.requestId }
  };
  return res.status(config8?.http_code).json(body);
};

// src/util/lodash/index.ts
var import_lodash_es = require("lodash-es");
var LodashHelper = class {
  static get(obj, path3, defaultVal) {
    return (0, import_lodash_es.get)(obj, path3, defaultVal);
  }
  static set(obj, path3, value) {
    return (0, import_lodash_es.set)(obj, path3, value);
  }
  static merge(target, ...sources) {
    return (0, import_lodash_es.merge)(target, ...sources);
  }
  static cloneDeep(value) {
    return (0, import_lodash_es.cloneDeep)(value);
  }
  static isEmpty(value) {
    return (0, import_lodash_es.isEmpty)(value);
  }
  static omit(obj, keys) {
    return (0, import_lodash_es.omit)(obj, keys);
  }
  static pick(obj, keys) {
    return (0, import_lodash_es.pick)(obj, keys);
  }
  static uniqBy(array, key) {
    return (0, import_lodash_es.uniqBy)(array, key);
  }
  static debounce(func, wait, options = {}) {
    return (0, import_lodash_es.debounce)(func, wait, options);
  }
  static getOrDefault(obj, path3, defaultVal = null) {
    return (0, import_lodash_es.get)(obj, path3, defaultVal);
  }
  static hasNestedKeys(obj, paths = []) {
    return paths.every((p) => (0, import_lodash_es.get)(obj, p) !== void 0);
  }
  static deepCloneAndSet(obj, path3, value) {
    const cloned = (0, import_lodash_es.cloneDeep)(obj);
    (0, import_lodash_es.set)(cloned, path3, value);
    return cloned;
  }
  static compactObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, val]) => val !== null && val !== void 0 && val !== ""
      )
    );
  }
};

// src/util/encryption/index.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var DEFAULT_SALT_ROUNDS = 10;
var DEFAULT_ENCRYPTION_KEY = process?.env?.ENCRYPTION_KEY || "12345678901234567890123456789012";
var IV_LENGTH = 16;
var EncryptionUtil = class {
  static async hash({
    password,
    saltRounds = DEFAULT_SALT_ROUNDS
  }) {
    return await import_bcrypt.default.hash(password, saltRounds);
  }
  static async compare({ password, hashed }) {
    return await import_bcrypt.default.compare(password, hashed);
  }
  static encrypt({
    text,
    key = DEFAULT_ENCRYPTION_KEY
  }) {
    if (!text) throw new Error("Text need to encrypt");
    const iv = import_crypto2.default.randomBytes(IV_LENGTH);
    const cipher = import_crypto2.default.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }
  static decrypt({
    encryptedText,
    key = DEFAULT_ENCRYPTION_KEY
  }) {
    if (!encryptedText) throw new Error("Encrypted text need to decrypt");
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = import_crypto2.default.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsyncRouteWrapper,
  AuthMiddleware,
  AxiosHelper,
  BodyParser,
  CompressionHandler,
  Cors,
  CronManager,
  DateUtilBusiness,
  DateUtilCompare,
  DateUtilCreate,
  DateUtilDuration,
  DateUtilEdgeCase,
  DateUtilFormat,
  DateUtilManipulate,
  DateUtilTimezone,
  DateUtilValidate,
  DateUtilsRange,
  DotEnv,
  EncryptionUtil,
  ErrorHandler,
  ExpressPack,
  JWTUtil,
  LodashHelper,
  LoggerHandler,
  ModelBuilder,
  Mongoose,
  MongooseCorePlugin,
  MongoosePerformancePlugin,
  MongoosePopulatePlugin,
  MongooseSecurityPlugin,
  NodeMailerService,
  PassportService,
  RabbitMQService,
  RateLimitHandler,
  RedisClientService,
  RequestTracer,
  RequestValidator,
  ResponseUtil,
  S3Service,
  SMSService,
  SecurityHandler,
  StripeService,
  TokenBlacklistedError,
  TokenExpiredError,
  TokenInvalidError,
  availablePlugins,
  i18n,
  logger,
  z
});
