var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

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
import bodyParser from "body-parser";

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
    if (config8?.json) app.use(bodyParser.json(config8.json));
    if (config8?.urlencoded) app.use(bodyParser.urlencoded(config8.urlencoded));
    if (config8?.raw) app.use(bodyParser.raw(config8.raw));
    if (config8?.text) app.use(bodyParser.text(config8.text));
  }
};

// src/common/compression/index.ts
import compression2 from "compression";

// src/config/common/compressionConfig.ts
import compression from "compression";
var config2 = {
  getConfig: (config8 = {}) => {
    const filter = config8.filter ?? ((req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
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
    app.use(compression2(config8));
    __privateSet(this, _initialized, true);
  }
  /**
   * Direct access to compression middleware
   */
  static getMiddleware(config8 = {}) {
    return compression2(config8);
  }
  static isInitialized() {
    return __privateGet(this, _initialized);
  }
};
_initialized = new WeakMap();
__privateAdd(CompressionHandler, _initialized, false);

// src/common/cors/index.ts
import cors from "cors";

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
    app.use(cors(config8));
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
import dotenv from "dotenv";
import path from "path";
var DotEnv = class {
  constructor() {
    this.envLib = dotenv;
  }
  static init({ customPath = "" }) {
    const envPath = path.resolve(process.cwd(), customPath || ".env");
    const env = dotenv.config({ path: envPath });
    if (env.error) {
      throw env.error;
    }
    return env.parsed;
  }
};

// src/db/connection/index.ts
import mongoose from "mongoose";
var _instance, _isConnected, _uri, _options, _Mongoose_static, connect_fn, reconnect_fn;
var _Mongoose = class _Mongoose {
  constructor() {
    if (__privateGet(_Mongoose, _instance)) return __privateGet(_Mongoose, _instance);
    __privateSet(_Mongoose, _instance, this);
    mongoose.connection.on("connected", () => {
      __privateSet(_Mongoose, _isConnected, true);
      console.log("[MongoDB] Connected");
    });
    mongoose.connection.on("disconnected", () => {
      __privateSet(_Mongoose, _isConnected, false);
      console.log("[MongoDB] Disconnected. Retrying in 5s...");
      setTimeout(() => {
        var _a;
        return __privateMethod(_a = _Mongoose, _Mongoose_static, reconnect_fn).call(_a);
      }, 5e3);
    });
    mongoose.connection.on("error", (err) => {
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
    return mongoose;
  }
};
_instance = new WeakMap();
_isConnected = new WeakMap();
_uri = new WeakMap();
_options = new WeakMap();
_Mongoose_static = new WeakSet();
connect_fn = async function() {
  try {
    await mongoose.connect(__privateGet(_Mongoose, _uri), __privateGet(_Mongoose, _options));
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
      await mongoose.connect(__privateGet(_Mongoose, _uri), __privateGet(_Mongoose, _options));
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

// src/db/model/index.ts
import mongoose4 from "mongoose";

// src/plugin/mongoose/core/index.ts
import slugify from "slugify";
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
  static SoftDelete(schema, option) {
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
          let baseSlug = slugify(sourceValue, {
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
            const existing = await ModelConstructor.exists(query);
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
    schema.pre(
      "save",
      async function(next) {
        if (!this.isNew && this.isModified()) {
          const clone = this.toObject({ depopulate: true });
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
      }
    );
  }
  static MultiTenancy(schema, options = {}) {
    const field = options.field || "shopId";
    schema.add({ [field]: { type: String, required: true, index: true } });
    const addTenantScope = function(next) {
      if (!this.getQuery()[field] && this.options?.tenantId) {
        this.where({ [field]: this.options.tenantId });
      }
      if (!this.getQuery()[field]) {
        const error = new Error("Tenant ID is required but was not provided.");
        next(error);
        return;
      }
      next();
    };
    schema.pre(
      "save",
      function(next) {
        if (!this[field] && this.tenantId) {
          this[field] = this.tenantId;
        }
        if (!this[field]) {
          const error = new Error(
            `The ${field} is required to save this document.`
          );
          next(error);
          return;
        }
        next();
      }
    );
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
import mongoose2 from "mongoose";
var MongoosePerformancePlugin = class {
  // 1. Index Manager Plugin
  static IndexManager(schema, options = { indexes: [] }) {
    return function(schema2) {
      const { indexes } = options;
      const db = mongoose2.connection.db;
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
        const db2 = mongoose2.connection.db;
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
    return function(schema2) {
      const { retries, delay } = options;
      schema2.pre("save", async function(next) {
        let attempt = 0;
        const saveWithRetry = async () => {
          try {
            await this.save();
            next();
          } catch (err) {
            if (attempt < retries) {
              attempt++;
              console.warn(
                `Retrying save attempt #${attempt} due to error: ${err.message}`
              );
              setTimeout(saveWithRetry, delay);
            } else {
              next(err);
            }
          }
        };
        saveWithRetry();
      });
    };
  }
};

// src/plugin/mongoose/populate/index.ts
import mongoose3 from "mongoose";
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
          if (this[path3] && mongoose3.isObjectIdOrHexString(this[path3])) {
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
          if (this[field] && mongoose3.isObjectIdOrHexString(this[field])) {
            this.populate(buildPopulateQuery(field));
          }
        });
        next();
      });
    };
  }
};

// src/plugin/mongoose/security/index.ts
import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";
var MongooseSecurityPlugin = class {
  static Sanitization(schema) {
    schema.pre(
      "save",
      function(next) {
        const sanitize = (value) => {
          if (typeof value === "string") {
            return sanitizeHtml(value, {
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
            const salt = await bcrypt.genSalt(10);
            this[field] = await bcrypt.hash(this[field], salt);
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
      return bcrypt.compare(password, this.password);
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
            const existingDoc = await this.constructor.findOne(query);
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
            const existingDoc = await this.model.findOne(query);
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

// src/db/model/index.ts
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
    if (mongoose4.models[name]) {
      return mongoose4.models[name];
    }
    const schema = new mongoose4.Schema(schemaDefinition, schemaOptions);
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
    return mongoose4.model(name, schema);
  }
};

// src/error/error-handler/index.ts
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

// src/error/token-error/index.ts
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

// src/express/index.ts
import express from "express";

// src/logger/winston/index.ts
import { createLogger } from "winston";

// src/config/logger/winstonConfig.ts
import { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path2 from "path";
var config4 = {
  logConfig: {
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      // Add a timestamp
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: [
      new transports.Console(),
      // Console logs
      new DailyRotateFile({
        filename: path2.join("logs", "app-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxFiles: `14d`,
        level: "info"
      }),
      new DailyRotateFile({
        filename: path2.join("logs", "errors-%DATE%.log"),
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
      format: config8?.format || format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // Add a timestamp
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      ),
      transports: config8?.transports || [
        new transports.Console(),
        // Console logs
        new DailyRotateFile({
          filename: path2.join("logs", "app-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxFiles: `14d`,
          level: "info"
        }),
        new DailyRotateFile({
          filename: path2.join("logs", "errors-%DATE%.log"),
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

// src/logger/winston/index.ts
var _logger, _initialized2;
var LoggerHandler = class {
  /**
   * Configure the Winston logger (only once)
   */
  static init(customConfig = {}) {
    if (__privateGet(this, _initialized2)) return;
    __privateSet(this, _logger, createLogger(winstonConfig_default.getConfig(customConfig)));
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

// src/security/express-rate-limit/index.ts
import { rateLimit } from "express-rate-limit";

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
      identifier: config8?.identifier || null,
      // Optional custom identifier for the policy
      store: config8?.store || null,
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

// src/security/express-rate-limit/index.ts
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
    __privateSet(this, _rateLimiterMiddleware, rateLimit(config8));
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

// src/security/helmet/index.ts
import helmet from "helmet";

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
      frameguard: config8?.frameguard || "sameorigin",
      hidePoweredBy: config8?.hidePoweredBy || false,
      hsts: config8?.hsts || {
        maxAge: 0,
        includeSubDomains: false,
        preload: false
      },
      ieNoOpen: config8?.ieNoOpen || false,
      noSniff: config8?.noSniff || false,
      originAgentCluster: config8?.originAgentCluster || false,
      referrerPolicy: config8?.referrerPolicy || "no-referrer-when-downgrade",
      xssFilter: config8?.xssFilter || true
    };
  }
};
var helmetConfig_default = config6;

// src/security/helmet/index.ts
var SecurityHandler = class {
  /**
   * Used to setup the security using helmet for app
   * @param app Express app
   * @param customConfig custom configuration if modification needed
   */
  static init({ app, customConfig = {} }) {
    this.config = helmetConfig_default?.getConfig(customConfig);
    app.use(helmet(this.config));
  }
};

// src/express/index.ts
var _app, _initialized4, _ExpressPack_static, applyMiddleware_fn;
var ExpressPack = class {
  /**
   * Initializes the express app with provided middleware config
   * @param config Middleware configuration object
   * @returns express app
   */
  static async init({
    config: config8 = {}
  }) {
    if (__privateGet(this, _initialized4) && __privateGet(this, _app)) return __privateGet(this, _app);
    __privateSet(this, _app, express());
    __privateGet(this, _app).use((req, res, next) => {
      const requestId = req.headers["x-request-id"] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader("X-Request-ID", requestId);
      next();
    });
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
    return express.Router();
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

// src/middleware/auth-middleware/index.ts
import jwt from "jsonwebtoken";
var AuthMiddlewareHandler = class {
  static AuthMiddleware({
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
  static authenticateUser({
    secret,
    headerKey = "authorization",
    usingBearer = true
  }) {
    return (req, res, next) => {
      const token = this.extractToken({ req, headerKey, usingBearer });
      if (!token) {
        return res.status(401).json({ message: "Authorization token not found" });
      }
      try {
        const decoded = jwt.verify(token, secret || process.env.JWT_SECRET);
        req.user = decoded;
        next();
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
import { ZodError } from "zod";
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
        if (err instanceof ZodError) {
          return res.status(400).json({ error: err.flatten() });
        }
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
};

// src/third-party/axios/index.ts
import axios from "axios";
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
    this.axiosInstance = axios.create({
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

// src/third-party/cron/index.ts
import { schedule } from "node-cron";
import Redlock from "redlock";
import axios2 from "axios";
import { format as format2 } from "date-fns";
import { randomBytes } from "crypto";

// src/third-party/redis/index.ts
import Redis from "ioredis";
var _RedisClientService = class _RedisClientService {
  constructor() {
    if (_RedisClientService.instance) {
      return _RedisClientService.instance;
    }
    _RedisClientService.instance = this;
  }
  static enableRedis(enable = true) {
    _RedisClientService.isRedisEnabled = enable;
    if (enable) {
      _RedisClientService.init();
    } else {
      _RedisClientService.disconnect();
    }
  }
  static init() {
    if (_RedisClientService.isRedisEnabled && !_RedisClientService.connected) {
      _RedisClientService.redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || void 0,
        db: Number(process.env.REDIS_DB) || 0
      });
      _RedisClientService.redis.on("connect", () => {
        _RedisClientService.connected = true;
        console.log("Connected to Redis");
      });
      _RedisClientService.redis.on("error", (err) => {
        console.error("Redis connection error: ", err);
        _RedisClientService.connected = false;
      });
    }
  }
  static async set(key, value, options) {
    if (!_RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping set operation.");
      return;
    }
    try {
      if (options?.expire) {
        await _RedisClientService.redis.set(key, value, "EX", options.expire);
      } else {
        await _RedisClientService.redis.set(key, value);
      }
      console.log(`Key "${key}" set successfully.`);
    } catch (err) {
      console.error("Error setting key:", err);
    }
  }
  static async get(key) {
    if (!_RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping get operation.");
      return;
    }
    try {
      const value = await _RedisClientService.redis.get(key);
      if (value === null) {
        console.log(`Key "${key}" not found.`);
        return null;
      }
      return value;
    } catch (err) {
      console.error("Error getting key:", err);
    }
  }
  static async del(key) {
    if (!_RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping delete operation.");
      return;
    }
    try {
      const result = await _RedisClientService.redis.del(key);
      if (result === 1) {
        console.log(`Key "${key}" deleted successfully.`);
      } else {
        console.log(`Key "${key}" not found.`);
      }
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  }
  static async expire(key, seconds) {
    if (!_RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping expiration operation.");
      return;
    }
    try {
      await _RedisClientService.redis.expire(key, seconds);
      console.log(`Key "${key}" will expire in ${seconds} seconds.`);
    } catch (err) {
      console.error("Error setting expiration:", err);
    }
  }
  static async keys(pattern = "*") {
    if (!_RedisClientService.isRedisEnabled) {
      console.log("Redis is disabled. Skipping keys operation.");
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
      console.log("Redis is disabled. Returning null client.");
      return null;
    }
    return _RedisClientService.redis;
  }
  static disconnect() {
    if (_RedisClientService.redis) {
      _RedisClientService.redis.disconnect();
      console.log("Disconnected from Redis");
    }
    _RedisClientService.connected = false;
  }
};
_RedisClientService.instance = null;
_RedisClientService.redis = null;
_RedisClientService.connected = false;
_RedisClientService.isRedisEnabled = false;
var RedisClientService = _RedisClientService;

// src/third-party/cron/index.ts
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
      this.redlock = new Redlock([this.redis], {
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
    const randomString = randomBytes(6).toString("base64");
    return `${timestamp}-${randomString}`;
  }
  async trackJobState(jobName, state) {
    const timestamp = format2(/* @__PURE__ */ new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
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
      return await this.db.collection(`cron_${this.serviceName}_jobStates`).findOne({ jobName });
    }
    return null;
  }
  async saveJobDefinition(name, cronExpression, apiConfig, options = {}) {
    const jobData = {
      name,
      cronExpression,
      apiConfig,
      options
    };
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
            const response = await axios2({
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
    const scheduledTask = schedule(cronExpression, executeTask, {
      scheduled: true,
      timezone: this.timezone
    });
    job.scheduledTask = scheduledTask;
    this.jobs.set(name, job);
    this.saveJobDefinition(name, cronExpression, apiConfig, options);
    if (runOnInit) {
      executeTask();
    }
    this.logger.info(
      `Job "${name}" registered to call "${apiConfig.url}" on schedule "${cronExpression}".`
    );
  }
  pauseJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask?.running) {
      job.scheduledTask.stop();
      job.state = "paused";
      this.trackJobState(name, "paused");
      this.logger.info(`Job "${name}" paused.`);
    }
  }
  resumeJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask && !job.scheduledTask?.running && job.state === "paused") {
      job.scheduledTask.start();
      job.state = "running";
      this.trackJobState(name, "running");
      this.logger.info(`Job "${name}" resumed.`);
    }
  }
  startJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask && !job.scheduledTask?.running) {
      job.scheduledTask.start();
      job.state = "running";
      this.trackJobState(name, "running");
      this.logger.info(`Job "${name}" started.`);
    }
  }
  stopJob(name) {
    const job = this.jobs.get(name);
    if (job && job.scheduledTask?.running) {
      job.scheduledTask.stop();
      job.state = "stopped";
      this.trackJobState(name, "stopped");
      this.logger.info(`Job "${name}" stopped.`);
    }
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

// src/third-party/node-mailer/transporter/index.ts
import nodemailer from "nodemailer";
var EmailTransporter = class {
  static create() {
    return nodemailer.createTransport({
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

// src/third-party/node-mailer/email-service/index.ts
var _EmailService = class _EmailService {
  static init() {
    if (!_EmailService.transporter) {
      _EmailService.transporter = EmailTransporter.create();
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
    if (!_EmailService.transporter) {
      throw new Error("EmailService not initialized. Please initialize first.");
    }
    const template = await _EmailService.getTemplate({
      templateName,
      templateParams
    });
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    const { subject, html } = template;
    return _EmailService.transporter.sendMail({
      from: _EmailService.defaultFrom,
      to,
      subject,
      html
    });
  }
};
_EmailService.transporter = null;
_EmailService.defaultFrom = process?.env?.DEFAULT_EMAIL_FROM;
var EmailService = _EmailService;

// src/third-party/rabbitmq/index.ts
import * as amqplib from "amqplib";
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

// src/third-party/s3/index.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
var _S3Service = class _S3Service {
  static init(config8) {
    if (!_S3Service.s3) {
      _S3Service.s3 = new S3Client({
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
    const command = new PutObjectCommand(params);
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
    const command = new GetObjectCommand({ Bucket, Key });
    try {
      const url = await getSignedUrl(_S3Service.s3, command, { expiresIn });
      return url;
    } catch (error) {
      throw new Error(`Error generating presigned URL: ${error.message}`);
    }
  }
  static async deleteFile(params) {
    if (!_S3Service.s3) {
      throw new Error("S3Service not initialized. Please initialize first.");
    }
    const command = new DeleteObjectCommand(params);
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

// src/util/date/business/index.ts
import { addDays, getDay } from "date-fns";
var DateUtilBusiness = class {
  static isBusinessDay(date) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      const day = getDay(date);
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
      let nextDay = addDays(date, 1);
      while (!this.isBusinessDay(nextDay)) {
        nextDay = addDays(nextDay, 1);
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
      let firstDayWeekday = getDay(firstDay);
      let daysToAdd = (weekday + 7 - firstDayWeekday) % 7;
      firstDay = addDays(firstDay, daysToAdd);
      return addDays(firstDay, 7 * (n - 1));
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
        currentDate = addDays(currentDate, n > 0 ? 1 : -1);
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
import {
  isBefore as compareBefore,
  isAfter as compareAfter,
  isEqual as isSame,
  compareAsc,
  isWithinInterval
} from "date-fns";
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
      return compareBefore(dateCopy, otherDateCopy);
    }
    return compareBefore(date, otherDate);
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
      return compareAfter(dateCopy, otherDateCopy);
    }
    return compareAfter(date, otherDate);
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
      return isSame(dateCopy, otherDateCopy);
    }
    return isSame(date, otherDate);
  }
  static compare(date, otherDate) {
    return compareAsc(date, otherDate);
  }
  static isBetween(date, start, end) {
    return isWithinInterval(date, { start, end });
  }
};

// src/util/date/create/index.ts
import { parse, fromUnixTime, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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
      const parsedDate = parse(value, dateFormat, /* @__PURE__ */ new Date());
      return isValid(parsedDate) ? toZonedTime(parsedDate, timezone) : null;
    }
    const date = new Date(value);
    return isValid(date) ? toZonedTime(date, timezone) : null;
  }
  /**
   * Return current timestamp with timezone
   */
  static now(timezone = "UTC") {
    return toZonedTime(/* @__PURE__ */ new Date(), timezone);
  }
  /**
   * Create from Unix timestamp (in seconds or milliseconds)
   */
  static fromUnix(unixTimestamp, timezone = "UTC") {
    const ts = unixTimestamp.toString().length === 10 ? unixTimestamp * 1e3 : unixTimestamp;
    return toZonedTime(fromUnixTime(ts / 1e3), timezone);
  }
  /**
   * Create from ISO string
   */
  static fromISOString(isoString, timezone = "UTC") {
    return toZonedTime(new Date(isoString), timezone);
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
    return toZonedTime(date, timezone);
  }
};

// src/util/date/duration/index.ts
import {
  differenceInMilliseconds,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  formatDistanceToNow,
  eachDayOfInterval
} from "date-fns";
var DateUtilDuration = class {
  static diff(date1, date2, unit, float = false) {
    try {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        throw new Error("Both inputs must be valid Date objects.");
      }
      let diff;
      switch (unit) {
        case "milliseconds":
          diff = differenceInMilliseconds(date1, date2);
          break;
        case "seconds":
          diff = differenceInSeconds(date1, date2);
          break;
        case "minutes":
          diff = differenceInMinutes(date1, date2);
          break;
        case "hours":
          diff = differenceInHours(date1, date2);
          break;
        case "days":
          diff = differenceInDays(date1, date2);
          break;
        case "weeks":
          diff = differenceInWeeks(date1, date2);
          break;
        case "months":
          diff = differenceInMonths(date1, date2);
          break;
        case "years":
          diff = differenceInYears(date1, date2);
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
      return formatDistanceToNow(date, { addSuffix: true });
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
      const weekdays = eachDayOfInterval({ start: from, end: to }).filter(
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
import { isValid as isValid2, max, min } from "date-fns";
var DateUtilEdgeCase = class {
  static handleInvalidFallback(date, fallback) {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return isValid2(d) ? d : fallback;
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
      return isValid2(date) ? date : null;
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
        (date) => date instanceof Date && isValid2(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return max(validDates);
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
        (date) => date instanceof Date && isValid2(date)
      );
      if (validDates.length === 0) {
        throw new Error("No valid dates provided.");
      }
      return min(validDates);
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
import { format as format3 } from "date-fns";
var DateUtilFormat = class {
  /**
   * Format date using a custom format string
   */
  static formatDate(date, formatStr) {
    return format3(date, formatStr);
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
import {
  addDays as addDays2,
  addMonths,
  addYears,
  addWeeks,
  addHours,
  addMinutes,
  addSeconds,
  subDays,
  subMonths,
  subYears,
  subWeeks,
  subHours,
  subMinutes,
  subSeconds,
  setYear,
  setMonth,
  setDate as setDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear
} from "date-fns";
var addMap = {
  days: addDays2,
  months: addMonths,
  years: addYears,
  weeks: addWeeks,
  hours: addHours,
  minutes: addMinutes,
  seconds: addSeconds
};
var subMap = {
  days: subDays,
  months: subMonths,
  years: subYears,
  weeks: subWeeks,
  hours: subHours,
  minutes: subMinutes,
  seconds: subSeconds
};
var setMap = {
  year: setYear,
  month: setMonth,
  day: setDay,
  hour: setHours,
  minute: setMinutes,
  second: setSeconds
};
var startMap = {
  day: startOfDay,
  month: startOfMonth,
  week: startOfWeek,
  year: startOfYear
};
var endMap = {
  day: endOfDay,
  month: endOfMonth,
  week: endOfWeek,
  year: endOfYear
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
import {
  eachDayOfInterval as eachDayOfInterval2,
  differenceInCalendarDays,
  isWithinInterval as isWithinInterval2,
  addDays as addDays3,
  startOfWeek as startOfWeek2,
  endOfWeek as endOfWeek2,
  eachMonthOfInterval
} from "date-fns";
var DateUtilsRange = class {
  /**
   * Get all dates in a range from start date to end date
   */
  static getDateRange(start, end) {
    try {
      if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error("start and end must be valid Date objects.");
      }
      return eachDayOfInterval2({ start, end });
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
        let startOfWeekDate = startOfWeek2(dateRange[0]);
        let endOfWeekDate = endOfWeek2(dateRange[0]);
        while (startOfWeekDate <= dateRange[dateRange.length - 1]) {
          const weekRange = eachDayOfInterval2({
            start: startOfWeekDate,
            end: endOfWeekDate
          });
          weeks.push(weekRange);
          startOfWeekDate = addDays3(startOfWeekDate, 7);
          endOfWeekDate = addDays3(endOfWeekDate, 7);
        }
        return weeks;
      }
      if (unit === "month") {
        const months = [];
        const monthRange = eachMonthOfInterval({
          start: dateRange[0],
          end: dateRange[dateRange.length - 1]
        });
        for (let i = 0; i < monthRange.length; i++) {
          months.push(
            eachDayOfInterval2({
              start: monthRange[i],
              end: addDays3(
                monthRange[i],
                differenceInCalendarDays(monthRange[i], monthRange[i + 1]) - 1
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
      return isWithinInterval2(start1, { start: start2, end: end2 }) || isWithinInterval2(end1, { start: start2, end: end2 }) || isWithinInterval2(start2, { start: start1, end: end1 }) || isWithinInterval2(end2, { start: start1, end: end1 });
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
import { toZonedTime as toZonedTime2 } from "date-fns-tz";
import { format as formatDate } from "date-fns";
var DateUtilTimezone = class {
  static convertToTZ(date, timezone) {
    try {
      if (!(date instanceof Date)) {
        throw new Error("Input must be a valid Date object.");
      }
      if (typeof timezone !== "string") {
        throw new Error("Timezone must be a valid string.");
      }
      const zonedDate = toZonedTime2(date, timezone);
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
      return formatDate(date, "P", { locale: new Intl.Locale(locale) });
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
import {
  isValid as isValidDate,
  parse as parse2,
  isLeapYear as checkLeapYear,
  isWeekend as checkWeekend,
  isSameDay as checkSameDay
} from "date-fns";
var DateUtilValidate = class {
  static isValid(date) {
    return isValidDate(date);
  }
  static parseDate(str, formats = []) {
    let parsedDate = null;
    for (const format4 of formats) {
      parsedDate = parse2(str, format4, /* @__PURE__ */ new Date());
      if (isValidDate(parsedDate)) {
        break;
      }
    }
    return parsedDate;
  }
  static isLeapYear(year) {
    return checkLeapYear(new Date(year, 0, 1));
  }
  static isDST(date) {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }
  static isWeekend(date) {
    return checkWeekend(date);
  }
  static isSameDay(date1, date2) {
    return checkSameDay(date1, date2);
  }
};

// src/util/jwt/index.ts
import jwt2 from "jsonwebtoken";
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
        accessToken: jwt2.sign(tokenPayload.payload || {}, secret, signOptions),
        refreshToken: await this.generateRefreshToken({
          payload: tokenPayload.payload,
          ...refreshTokenPayload
        })
      };
    } else {
      const { payload } = tokenPayload;
      return jwt2.sign(payload || {}, secret, signOptions);
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
    if (expiresIn) {
      signOptions.expiresIn = process.env.REFRESH_TOKEN_EXPIRE_TOKEN || "7d";
    }
    return jwt2.sign(payload, REFRESH_SECRET, signOptions);
  }
  static async verify({ token, JWT_SECRET = "" }) {
    try {
      const secret = JWT_SECRET || process?.env?.JWT_SECRET || "";
      if (!secret) throw new Error("JWT secret is required for verification");
      return jwt2.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw new TokenExpiredError();
      if (err.name === "JsonWebTokenError") throw new TokenInvalidError();
      throw err;
    }
  }
  static decode({ token }) {
    return jwt2.decode(token);
  }
  static async verifyRefreshToken({
    token,
    REFRESH_SECRET = process?.env?.REFRESH_SECRET || ""
  }) {
    try {
      if (!REFRESH_SECRET) {
        throw new Error("Refresh secret is required for verification");
      }
      const payload = jwt2.verify(token, REFRESH_SECRET);
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

// src/util/i18n/index.ts
import i18next from "i18next";
var config7 = {};
var initialized = false;
var i18n = {
  async init({ config: configObj, locales }) {
    if (initialized) return;
    config7 = configObj;
    await i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources: locales,
      interpolation: { escapeValue: false }
    });
    initialized = true;
  },
  getMessage(locale, key) {
    return i18next.t(key, { lng: locale });
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
    ...data,
    ...message && { message },
    ...req.requestId && { requestId: req.requestId }
  };
  return res.status(config8?.http_code).json(body);
};

// src/util/lodash/index.ts
import {
  get,
  set,
  merge,
  cloneDeep,
  isEmpty,
  omit,
  pick,
  uniqBy,
  debounce
} from "lodash-es";
var LodashHelper = class {
  static get(obj, path3, defaultVal) {
    return get(obj, path3, defaultVal);
  }
  static set(obj, path3, value) {
    return set(obj, path3, value);
  }
  static merge(target, ...sources) {
    return merge(target, ...sources);
  }
  static cloneDeep(value) {
    return cloneDeep(value);
  }
  static isEmpty(value) {
    return isEmpty(value);
  }
  static omit(obj, keys) {
    return omit(obj, keys);
  }
  static pick(obj, keys) {
    return pick(obj, keys);
  }
  static uniqBy(array, key) {
    return uniqBy(array, key);
  }
  static debounce(func, wait, options = {}) {
    return debounce(func, wait, options);
  }
  static getOrDefault(obj, path3, defaultVal = null) {
    return get(obj, path3, defaultVal);
  }
  static hasNestedKeys(obj, paths = []) {
    return paths.every((p) => get(obj, p) !== void 0);
  }
  static deepCloneAndSet(obj, path3, value) {
    const cloned = cloneDeep(obj);
    set(cloned, path3, value);
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
import bcrypt2 from "bcrypt";
import crypto from "crypto";
var DEFAULT_SALT_ROUNDS = 10;
var DEFAULT_ENCRYPTION_KEY = process?.env?.ENCRYPTION_KEY || "12345678901234567890123456789012";
var IV_LENGTH = 16;
var EncryptionUtil = class {
  static async hash({
    password,
    saltRounds = DEFAULT_SALT_ROUNDS
  }) {
    return await bcrypt2.hash(password, saltRounds);
  }
  static async compare({ password, hashed }) {
    return await bcrypt2.compare(password, hashed);
  }
  static encrypt({
    text,
    key = DEFAULT_ENCRYPTION_KEY
  }) {
    if (!text) throw new Error("Text need to encrypt");
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
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
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
export {
  AsyncRouteWrapper,
  AuthMiddlewareHandler,
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
  EmailService,
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
  RabbitMQService,
  RateLimitHandler,
  RedisClientService,
  RequestTracer,
  RequestValidator,
  ResponseUtil,
  S3Service,
  SecurityHandler,
  TokenBlacklistedError,
  TokenExpiredError,
  TokenInvalidError,
  availablePlugins,
  i18n,
  logger
};
