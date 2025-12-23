# express-pack

![Express-Pack Logo](https://i.ibb.co/1t1zKdvf/express-pack-logo-1-1-2.png) <!-- Replace with actual logo if available -->
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

[![npm version](https://img.shields.io/npm/v/express-pack.svg)](https://www.npmjs.com/package/express-pack)
[![License](https://img.shields.io/npm/l/express-pack.svg)](https://github.com/your-repo/express-pack/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/express-pack)](https://www.npmjs.com/package/express-pack)

`express-pack`is a modular and scalable utility library built to enhance and simplify Express.js backend development. It provides ready-to-use features such as multi-tenant handling, request validation, authentication, authorization, scoped queries, job scheduling, caching, and messaging integrations — all implemented with clean design patterns and developer flexibility in mind.

It’s designed to reduce boilerplate code and bring enterprise-grade patterns (middleware orchestration, service wrappers, extensibility hooks, retry handlers, scoped query management, etc.) to everyday Express projects.

---

## 📖 Table of Contents

1. [🚀 Key Features](#-key-features)
2. [📦 Installation](#-installation)
3. [📂 Project Structure & Usage](#-project-structure--usage)
4. [⚙️ Configuration](#-configuration)

   - [App Configuration](#1️⃣-app-configuration-appconfigjs)
   - [Route Configuration](#2️⃣-route-configuration-routeconfigjs)
   - [Message Configuration](#3️⃣-message-configuration-messageconfigjs)
   - [Locale Configuration](#4️⃣-locale-configuration-localeenconfigjs)

5. [🟢 Initialization & Usage](#-initialization--usage)
6. [🛠 Third-Party Integrations](#-third-party-integrations)

   - [Redis Client](#1-redis-client)
   - [RabbitMQ Service](#2-rabbitmq-service)
   - [Cron Manager](#3-cron-manager)

7. [🛠 Using in Routes](#-using-express-pack-in-routes)
8. [📝 Mongoose Schema & Plugins](#-mongoose-schema--plugins)
9. [Using ResponseUtil for Consistent API Response](#-using-responseutil-for-consistent-api-responses)
10. [🛠 Utilities](#-utilities)

---

## 🚀 Key Features

### 🧱 Core Utilities

- **Plug-and-play structure** for Express applications — easily composable modules.
- **Automatic error handling** with standardized response formats.
- **Async-safe** route and middleware execution.
- **Centralized configuration management** for consistent behavior across environments.

---

### 🔐 Authentication & Authorization

- **JWT-based authentication middleware** for secure API access.
- **Fine-grained role-based access control (RBAC)** using `authorizeRole`.
- **Flexible scope-based authorization** via `authorizeScope` — supports partial, strict, or all-scope validation.
- **Extensible design** to integrate with any authentication provider.

---

### 🏢 Multi-Tenant Support

- **Built-in tenant scoping** for Mongoose models.
- Ensures **tenant data isolation** and safe cross-tenant query handling.
- **Middleware-level tenant injection and validation** for consistent data access.

---

### 📦 Request Handling

- **Centralized validation system** for request bodies, queries, and params.
- Supports **schema-based validation** and **custom rule extensions**.
- Provides **smart error responses** for invalid input.

---

### 🧰 Plugins & Middleware Enhancements

- **Extendable plugin architecture** — easily add caching, retry logic, or queue handlers.
- **Retry handler** for failed database or network operations with customizable backoff strategies.
- **Rich logging system** integrated with Winston for structured and leveled logs.

---

### 🕒 Job Scheduling

- **Integrated cron job management** powered by `node-cron`.
- **Distributed lock handling** via Redlock to prevent duplicate executions in clustered setups.
- Supports **pause, resume, and skip-if-paused** workflows.

---

### 📨 Messaging & Queues

- **RabbitMQ integration** for message-driven communication between services.
- **Automatic retry and reconnection handling** with exponential backoff.
- **Simple API** for publishing, consuming, and acknowledging jobs or events.

---

### ⚙️ Caching

- **Built-in Redis client service** for efficient key-value caching.
- **Cache wrappers** for Express middleware and Mongoose queries.
- **TTL-based expiration** and **namespace management** for cache organization.

---

### 🧠 Design Philosophy

**express-pack** follows three guiding principles:

1. **Modular Architecture** — Each feature (auth, validation, tenant, queue, etc.) is independent and can be enabled selectively.
2. **Convention over Configuration** — Predefined patterns and sensible defaults help you move faster with minimal setup.
3. **Enterprise Scalability** — Designed for distributed systems with support for scoped access, job orchestration, and resilient service communication.

---

## 📦 Installation

Install **express-pack** using **npm** or **yarn**:

```bash
# Using npm
npm install express-pack
```

```bash
# Or using yarn
yarn add express-pack
```

# 📂 Project Structure & Usage

## Project Structure

```
project-root/
│
├─ src/
│  ├─ config/
│  │  ├─ appConfig.js              # App-level configurations (CORS, logger, etc.)
│  │  ├─ routeConfig.js            # API routes and prefixes
│  │  ├─ messages/messageConfig.js # Standardized message codes
│  │  └─ locale/
│  │     └─ en/localeEnConfig.js   # English translations
│  │
│  ├─ modules/
│  │  └─ user/
│  │     ├─ address/router/address.router.js
│  │     ├─ cart/router/cart.router.js
│  │     ├─ notification/router/notification.router.js
│  │     └─ user/router/user.router.js
│  │
│  ├─ services/
│  │  ├─ redis/index.js
│  │  ├─ queue/rabbitmq.js
│  │  └─ cron/index.js
│  │
│  ├─ loaders/
│  │  └─ index.js                 # Centralized initialization
│  │
│  └─ app.js                       # App entry point
│
├─ index.js                        # Start script
├─ package.json
└─ .env
```

---

## ⚙️ Configuration

All application configuration is centralized under `src/config/`.

### 1️⃣ App Configuration (`appConfig.js`)

Controls app-level settings like CORS, logger, security, compression, and rate limiting.

```javascript
const appConfig = {
  env: "development",
  cors: {},
  logger: {},
  bodyParser: {},
  security: {},
  compression: {},
  "express-rate-limit": {}, // renamed for clarity
};

export default appConfig;
```

---

### 2️⃣ Route Configuration (`routeConfig.js`)

Defines API routes, prefixes, and versions. Each route references its corresponding module router.

```javascript
import addressRouter from "../modules/user/address/router/address.router.js";
import cartRouter from "../modules/user/cart/router/cart.router.js";
import notificationRouter from "../modules/user/notification/router/notification.router.js";
import userRouter from "../modules/user/user/router/user.router.js";

const routeConfig = {
  routes: [
    {
      prefix: "/api",
      version: "/v1",
      route: [
        { path: "/address", route: addressRouter },
        { path: "/cart", route: cartRouter },
        { path: "/notification", route: notificationRouter },
        { path: "/user", route: userRouter },
      ],
    },
  ],
};

export default routeConfig;
```

---

### 3️⃣ Message Configuration (`messageConfig.js`)

Standardized messages for API responses.

```javascript
export default {
  INTERNAL_SERVER_ERROR: {
    http_code: 500,
    code: "INTERNAL_SERVER_ERROR",
    success: false,
  },
  DATA_NOT_FOUND: { http_code: 400, code: "DATA_NOT_FOUND", success: false },
  SUCCESS: { http_code: 200, code: "SUCCESS", success: true },
  PASSWORD_MISMATCH: {
    http_code: 400,
    code: "PASSWORD_MISMATCH",
    success: false,
  },
  USER_ALREADY_EXIST: {
    http_code: 200,
    code: "USER_ALREADY_EXIST",
    success: true,
  },
  REGISTER_SUCCESS: { http_code: 200, code: "REGISTER_SUCCESS", success: true },
};
```

---

### 4️⃣ Locale Configuration (`localeEnConfig.js`)

English translation strings.

```javascript
export default {
  INTERNAL_SERVER_ERROR: "Internal server error",
  DATA_NOT_FOUND: "Data not found",
  SUCCESS: "Request successful",
  PASSWORD_MISMATCH: "Password is incorrect",
  USER_ALREADY_EXIST: "User already exists",
  REGISTER_SUCCESS: "User registered successfully",
};
```

---

## 🟢 Initialization & Usage

All initialization is centralized in `src/loaders/index.js` for modular setup.

```javascript
import { ExpressPack, ErrorHandler, i18n, Mongoose } from "express-pack";
import express from "express";

import appConfig from "../config/appConfig.js";
import routesConfig from "../config/routeConfig.js";
import messageConfig from "../config/messages/messageConfig.js";
import localeEnConfig from "../config/locale/en/localeEnConfig.js";

import RedisService from "../services/redis/index.js";
import RabbitMQService from "../services/queue/rabbitmq.js";
import CronService from "../services/cron/index.js";

export const initializeApp = async () => {
  // Handle uncaught exceptions and unhandled rejections
  ErrorHandler.handleProcessError();

  // Initialize ExpressPack
  ExpressPack.init({ app: express(), config: appConfig });
  const app = ExpressPack.getApp();

  // Initialize database
  Mongoose.init({ uri: process.env.DB_URL });

  // Initialize external services
  await RedisService();
  await RabbitMQService();
  CronService();

  // Initialize internationalization
  i18n.init({
    config: messageConfig,
    locales: { en: { translation: localeEnConfig } },
  });

  // Initialize routes
  ExpressPack.initRoutes({ routes: routesConfig.routes });

  // Error handling middleware
  app.use(ErrorHandler.handleGlobalError);
  app.use(ErrorHandler.handleNotFoundRoute);

  return app;
};
```

---

### `index.js` Example

```javascript
import { initializeApp } from "./src/loaders/index.js";

const PORT = process.env.PORT || 3000;

(async () => {
  const app = await initializeApp();
  app.listen(PORT, () => {
    console.log(`✅ App is running on port ${PORT}`);
  });
})();
```

---

## 📌 Configuration Options

### **Body Parser Configuration**

Handles request body parsing.

| Option       | Default Value                                          | Description               |
| ------------ | ------------------------------------------------------ | ------------------------- |
| `json`       | `{ limit: "100kb" }`                                   | Limits JSON body size     |
| `urlencoded` | `{ extended: true, limit: "100kb" }`                   | Parses URL-encoded bodies |
| `raw`        | `{ type: "application/octet-stream", limit: "100kb" }` | Parses raw binary data    |
| `text`       | `{ type: "text/plain", limit: "100kb" }`               | Parses plain text         |

**Example Usage:**

```javascript
bodyParser: {
  json: { limit: "1mb" },
  urlencoded: { extended: true, limit: "500kb" },
},
```

---

### **CORS Configuration**

Manages cross-origin resource sharing.

| Option              | Default Value                                       | Description                          |
| ------------------- | --------------------------------------------------- | ------------------------------------ |
| `methods`           | `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]` | Allowed HTTP methods                 |
| `allowedHeaders`    | `undefined`                                         | Headers allowed from requests        |
| `exposedHeaders`    | `[]`                                                | Custom headers exposed to client     |
| `credentials`       | `false`                                             | Allows sending cookies               |
| `maxAge`            | `86400`                                             | Cache preflight requests             |
| `preflightContinue` | `false`                                             | Pass preflight responses to handlers |

**Example Usage:**

```javascript
cors: {
  methods: ["GET", "POST"],
  credentials: true,
},
```

---

### **Logger Configuration**

Handles application logging using Winston.

| Option        | Default Value         | Description         |
| ------------- | --------------------- | ------------------- |
| `level`       | `"info"`              | Logging level       |
| `format`      | `timestamp + message` | Log format          |
| `transports`  | `[Console, File]`     | Output destinations |
| `exitOnError` | `false`               | Exit on error       |

**Example Usage:**

```javascript
logger: {
  level: "debug",
  transports: [new transports.Console()],
},
```

---

### **Security Configuration**

Enhances security with Helmet.js settings.

| Option                  | Default Value   | Description                    |
| ----------------------- | --------------- | ------------------------------ |
| `contentSecurityPolicy` | `false`         | Enables CSP headers            |
| `dnsPrefetchControl`    | `true`          | Controls DNS prefetching       |
| `frameguard`            | `"sameorigin"`  | Prevents clickjacking          |
| `hsts`                  | `{ maxAge: 0 }` | HTTP Strict Transport Security |
| `noSniff`               | `false`         | Prevents MIME sniffing         |
| `xssFilter`             | `true`          | Enables XSS protection         |

**Example Usage:**

```javascript
security: {
  hsts: { maxAge: 31536000 },
  xssFilter: false,
},
```

### **Compression Configuration**

Optimizes server performance by compressing HTTP responses.

| Option      | Default Value | Description                                                                       |
| ----------- | ------------- | --------------------------------------------------------------------------------- |
| `level`     | `6`           | Compression level (0-9) for Gzip. Higher values result in better compression.     |
| `threshold` | `1024`        | Only compress responses larger than 1KB. Smaller responses are sent uncompressed. |
| `filter`    | `Function`    | A function to determine whether to apply compression based on request/response.   |

**Example Usage:**

```javascript
compression: {
  level: 9,
  threshold: 2048,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false; // Skip compression if client requests no compression
    }
    return compression.filter(req, res); // Default compression filter
  },
},
```

### **Express Rate Limit Configuration**

Controls request rate limiting to prevent abuse or excessive requests.

| Option            | Default Value                                  | Description                                               |
| ----------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `windowMs`        | `60000`                                        | Time frame in milliseconds for which requests are counted |
| `max`             | `100`                                          | Maximum number of requests allowed per `windowMs`         |
| `message`         | `"Too many requests, please try again later."` | Response sent when limit is exceeded                      |
| `standardHeaders` | `true`                                         | Send rate limit info in the `RateLimit-*` headers         |
| `legacyHeaders`   | `false`                                        | Disable `X-RateLimit-*` headers                           |
| `skip`            | `undefined`                                    | Function to skip certain requests (return true to skip)   |
| `keyGenerator`    | `undefined`                                    | Function to generate custom keys for clients              |

**Example Usage:**

```javascript
"express-rate-limit": {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // limit each IP to 50 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
},
```

# **🛠 Third-Party Integrations**

`express-pack` provides ready-to-use integrations for **Redis**, **RabbitMQ**, and **Cron jobs**, making backend development faster and cleaner.

---

## **1. Redis Client**

### **⚡ Initialization / Connection**

```javascript
import { RedisClientService } from "express-pack";

const ConnectRedis = () => {
  RedisClientService.enableRedis(true, {
    REDIS_HOST: "127.0.0.1",
    REDIS_PORT: 6379,
    REDIS_PASSWORD: "yourpassword",
    REDIS_DB: 0,
  });
};

export default ConnectRedis;
```

### **🚀 Usage Examples**

```javascript
// 💾 Set key with optional expiration
await RedisClientService.set("key1", "value1");
await RedisClientService.set("key2", "value2", { expire: 60 }); // expires in 60 sec

// 🔍 Get key
const value = await RedisClientService.get("key1");

// ❌ Delete key
await RedisClientService.del("key2");

// ⏳ Set expiration
await RedisClientService.expire("key1", 120); // expire in 120 sec

// 🗂 List keys
const keys = await RedisClientService.keys("*");

// 🧩 Get Redis client instance
const client = RedisClientService.getClient();
```

---

## **2. RabbitMQ Service**

### **⚡ Initialization / Connection**

```javascript
import { RabbitMQService } from "express-pack";

const ConnectRabbitMQ = async () => {
  const config = {
    enabled: true,
    uri: "amqp://user:password@localhost:5672",
    prefetch: 5,
    exchanges: [{ name: "logs", type: "fanout" }],
    queues: [{ name: "task_queue", options: { durable: true } }],
  };

  await RabbitMQService.init(config);
};

export default ConnectRabbitMQ;
```

### **🚀 Usage Examples**

```javascript
// 📤 Publish to exchange
await RabbitMQService.publishToExchange("logs", "", { message: "Hello" });

// 📥 Publish to queue
await RabbitMQService.publishToQueue("task_queue", { task: "send_email" });

// 🎧 Consume messages from a queue
await RabbitMQService.consume(
  "task_queue",
  async (msg) => {
    console.log("Received message:", msg);
  },
  {
    retryAttempts: 3,
    retryDelayMs: 1000,
  }
);

// 🧩 Get channel instance
const channel = RabbitMQService.getChannel();
```

---

## **3. Cron Manager**

### **⚡ Initialization / Connection**

```javascript
import { CronManager, RedisClientService } from "express-pack";

const InitCronManager = () => {
  const cron = new CronManager({
    serviceName: "my-service",
    redis: RedisClientService.getClient(),
    persistent: true,
    timezone: "Asia/Kolkata",
    persistService: "redis", // or "mongodb"
  });

  return cron;
};

export default InitCronManager;
```

### **🚀 Usage Examples**

```javascript
const cron = InitCronManager();

// 🆕 Register a cron job
cron.registerJob(
  "test-job",
  "*/1 * * * *", // every 1 minute
  { url: "https://jsonplaceholder.typicode.com/todos/1", method: "GET" },
  { runOnInit: true, retry: 2 }
);

// ⏸ Pause a job
cron.pauseJob("test-job");

// ▶️ Resume a job
cron.resumeJob("test-job");

// 🛑 Stop a job
cron.stopJob("test-job");

// ❌ Remove a job
await cron.removeJob("test-job");

// 📄 List all registered jobs
console.log(cron.listJobs());

// 🔍 Track job state manually
await cron.getJobState("test-job");
await cron.trackJobState("test-job", "running");
```

---

### ✅ Notes

- 🟢 Always initialize Redis before using CronManager with Redis persistence.
- 🐰 RabbitMQ consumers auto-reconnect if the connection drops.
- ⏰ CronManager supports dynamic job management: pause, resume, stop, and remove jobs at runtime.
- 🗂 Keep all service initialization in a **central config file** to keep router and service files clean.

## 🛠 Using `express-pack` in Routes

`express-pack` provides a **modular, clean, and scalable** approach to building Express routes with:

- **Request validation** (`body`, `query`, `params`)
- **Async route handling**
- **JWT authentication**
- **Automatic error handling**

### **1️⃣ Router Setup (Clean & Configurable)**

We recommend separating route-specific configurations (validation and auth) from the router file to keep it clean:

```javascript
// src/routes/user.router.js
import {
  ExpressPack,
  RequestValidator,
  AuthMiddleware,
  AsyncRouteWrapper,
} from "express-pack";
import express from "express";

import {
  login,
  register,
  userDelete,
  userProfileDetails,
} from "../controller/user.controller.js";

import UserHelper from "../helper/user.helper.js";

// Import pre-defined route config
import { userRoutesConfig } from "../config/routes/userRoutesConfig.js";

const router = ExpressPack.getRouter();

// ===============================
// Routes
// ===============================

// Login route
router.post(
  "/login",
  RequestValidator.validateRequest(userRoutesConfig.login.validation),
  AsyncRouteWrapper.asyncHandler(login)
);

// Register route
router.post(
  "/register",
  RequestValidator.validateRequest(userRoutesConfig.register.validation),
  AsyncRouteWrapper.asyncHandler(register)
);

// Profile details
router.get(
  "/profile-details",
  AuthMiddleware.authenticateUser(userRoutesConfig.profile.auth),
  AsyncRouteWrapper.asyncHandler(userProfileDetails)
);

// Delete user by ID
router.delete(
  "/:user_id",
  AuthMiddleware.authenticateUser(userRoutesConfig.delete.auth),
  RequestValidator.validateRequest(userRoutesConfig.delete.validation),
  AsyncRouteWrapper.asyncHandler(userDelete)
);

export default router;
```

---

### **2️⃣ Route Configuration Example**

Keep all validation and auth configurations in a separate file:

```javascript
// src/config/routes/userRoutesConfig.js
import { z } from "zod";
import UserHelper from "../../helper/user.helper.js";

export const userRoutesConfig = {
  login: {
    validation: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  },
  register: {
    validation: {
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  },
  profile: {
    auth: {
      secret: process.env.JWT_SECRET,
      headerKey: "authorization",
      usingBearer: true,
      callback: UserHelper.getUser,
    },
  },
  delete: {
    auth: {
      secret: process.env.JWT_SECRET,
      headerKey: "authorization",
      usingBearer: true,
      callback: UserHelper.getUser,
    },
    validation: {
      params: z.object({
        user_id: z.string().uuid(), // Example: validate user_id is UUID
      }),
      query: z.object({
        force: z.boolean().optional(), // Optional query param
      }),
    },
  },
};
```

---

### **3️⃣ Request Validation**

`RequestValidator.validateRequest` automatically validates `params`, `query`, and `body` using Zod schemas:

```javascript
RequestValidator.validateRequest({
  body: z.object({ email: z.string().email(), password: z.string().min(6) }),
  params: z.object({ user_id: z.string().uuid() }),
  query: z.object({ force: z.boolean().optional() }),
});
```

**Behavior:**

- `req.data` contains parsed and validated data
- Returns `400` if validation fails
- Returns `500` for unexpected errors

---

### **4️⃣ Async Route Handling**

Wrap your async controllers with `AsyncRouteWrapper` to automatically forward errors to Express error handlers:

```javascript
AsyncRouteWrapper.asyncHandler(async (req, res) => {
  const user = await UserHelper.getUser(req);
  res.json({ data: user });
});
```

---

### **5️⃣ JWT Authentication**

Authenticate routes easily using `AuthMiddleware.authenticateUser`:

```javascript
AuthMiddleware.authenticateUser({
  secret: process.env.JWT_SECRET,
  headerKey: "authorization",
  usingBearer: true,
  callback: UserHelper.getUser, // returns user object -> attached to req.user
});
```

- If valid, attaches user to `req.user`
- If invalid, responds with `401 Unauthorized`

---

### **6️⃣ Key Advantages**

- ✅ **Clean router files** — All configs (validation & auth) centralized.
- ✅ **Supports body, params, and query validation**.
- ✅ **Async-safe** — No need for repetitive `try/catch`.
- ✅ **Secure** — Built-in JWT authentication.
- ✅ **Scalable** — Easy to extend for more routes or modules.

---

# 📝 Mongoose Schema & Plugins

`express-pack` provides **ModelBuilder** to create Mongoose models with **powerful plugins** for:

- Multi-tenancy
- Soft delete
- Versioning
- Slug generation
- Field encryption
- Pagination
- Schema validation
- Retry handlers
- Unique constraints

---

## **1️⃣ Define Schema & Build Model**

```javascript
import { ModelBuilder, z } from "express-pack";

// 🔹 Define schema fields
const userSchema = {
  org_id: { type: String, required: true }, // Tenant ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userRole: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  token: { type: String },
  lastLogin: { type: Date },
  currentOrder: { type: Number, default: 0 },
  returnedCount: { type: Number, default: 0 },
  shopName: { type: String },
  shopMobileNumber: { type: String },
  shopAddress: { type: String },
  isDeleted: { type: Boolean },
  deletedAt: { type: Date },
};

// 🔹 Build model with plugins
const User = ModelBuilder.build({
  name: "user",
  schemaDefinition: userSchema,
  schemaOptions: {},

  plugins: {
    // 🏷 Multi-tenancy
    multiTenancy: { field: "org_id" },

    // ⏱ Timestamps
    timestamps: true,

    // 🗑 Soft delete
    softDelete: true,

    // 🔢 Versioning
    versioning: true,

    // 🧹 Sanitize inputs
    sanitize: true,

    // 📄 Pagination support
    pagination: true,

    // 🔗 Slug generator
    slugGenerator: { slugField: "slug", sourceField: "name", unique: true },

    // 📊 Index manager
    indexManager: {
      indexes: [
        {
          field: "name",
          type: 1,
          name: "idx_name_asc",
          options: { unique: false },
        },
      ],
    },

    // 🔁 Retry handler
    retryHandler: { retries: 5, delay: 1500 },

    // 🔒 Field encryption
    fieldEncryption: { fields: ["password"] },

    // ✅ Unique constraint
    uniqueConstraint: {
      fields: ["email"],
      messages: { email: "Email already exists" },
    },

    // 🧪 Schema validation
    schemaValidation: {
      validate: {
        email: z.string().email({ message: "Invalid email format" }),
        age: z.number().min(0, { message: "Age must be non-negative" }),
      },
    },
  },
});

export default User;
```

---

## **2️⃣ Model Usage Examples**

### **⚡ Create / Save**

```javascript
const newUser = new User({
  org_id: "tenant_123", // required tenant ID
  name: "Alice",
  email: "alice@example.com",
  password: "12345",
});

// 🔁 Save with retry
await newUser.saveWithRetry();
```

---

### **⚡ Find One**

```javascript
// Multi-tenancy applied automatically
const user = await User.findOne({
  org_id: "tenant_123",
  email: "alice@example.com",
});

// Skip tenant filter if needed
const userWithoutTenant = await User.findOne(
  { email: "alice@example.com" },
  null,
  { skipTenantCheck: true }
);
```

---

### **⚡ Find / Paginate**

```javascript
// Paginate users for a tenant
const paginatedUsers = await User.paginate({
  page: 1,
  limit: 10,
  filter: { org_id: "tenant_123", userRole: "user" }, // tenant + filter
  sort: { name: 1 },
});

// Skip tenant check (use carefully)
const allUsers = await User.paginate({
  page: 1,
  limit: 10,
  filter: { userRole: "user" },
  skipTenantCheck: true,
});
```

---

### **⚡ Update**

```javascript
// Update a user (multi-tenancy applied automatically)
await User.update(
  { org_id: "tenant_123", _id: user._id },
  { userRole: "seller" }
);

// Skip tenant check
await User.update(
  { _id: user._id },
  { userRole: "admin" },
  { skipTenantCheck: true }
);
```

---

### **⚡ Soft Delete / Restore**

```javascript
// Soft delete a document
await user.softDelete();

// Restore a soft-deleted document
await user.restore();
```

---

### **⚡ Slug / Versioning / Encryption**

```javascript
// Slug generated automatically from name
console.log(user.slug);

// Version increments automatically
user.name = "Alice Updated";
await user.saveWithRetry();
console.log(user.__v); // version number

// Encrypted fields automatically decrypted on find
console.log(user.password); // decrypted password
```

---

### **⚡ Unique Constraint / Validation**

```javascript
try {
  const invalidUser = new User({
    email: "invalidemail",
    org_id: "tenant_123",
    name: "Bob",
  });
  await invalidUser.saveWithRetry();
} catch (err) {
  console.error(err.message); // Validation error or unique constraint
}
```

---

### **💡 Key Notes**

- Multi-tenancy (`org_id`) is applied **automatically** to all queries, updates, deletes, and pagination.
- Always provide `org_id` when creating or querying a document.
- Use `{ skipTenantCheck: true }` **only when explicitly needed** to bypass tenant filtering.
- `saveWithRetry` retries transient DB failures automatically.
- Soft delete integrates with **find** and **paginate**. Deleted documents are ignored unless restored.
- Slug, versioning, encryption, and validation are **automatic** once enabled.
- Pagination supports filtering by tenant automatically.

---

# 🛠 Using ResponseUtil for Consistent API Responses

`express-pack` provides **`ResponseUtil`** to standardize API responses across your application. It ensures consistent HTTP status codes, success flags, messages, and optional request IDs.

---

### **Example Controller**

```javascript
import User from "../../../../schema/user/user.schema.js";
import Wishlist from "../../../../schema/wishlist/wishlist.schema.js";
import { ResponseUtil } from "express-pack";

// Example: Login Controller
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).setOptions({
      skipTenantCheck: true,
    });

    if (!user) {
      return ResponseUtil.send(req, res, "DATA_NOT_FOUND");
    }

    // Example: password validation & JWT generation skipped

    ResponseUtil.send(req, res, "SUCCESS", {
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    ResponseUtil.send(req, res, "INTERNAL_SERVER_ERROR");
  }
};

// Example: Register Controller
export const register = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseUtil.send(req, res, "USER_ALREADY_EXIST");
    }

    const newUser = new User({ name, email });
    await newUser.saveWithRetry();

    await Wishlist.create({ name: "General", userId: newUser._id });

    ResponseUtil.send(req, res, "REGISTER_SUCCESS");
  } catch (error) {
    ResponseUtil.send(req, res, "INTERNAL_SERVER_ERROR");
  }
};
```

---

### **How ResponseUtil Works**

- **Signature:** `ResponseUtil.send(req, res, code, data?)`

  - `req` – Express request object
  - `res` – Express response object
  - `code` – Message code from your configuration (e.g., `"SUCCESS"`, `"DATA_NOT_FOUND"`)
  - `data` – Optional response payload

- **Features:**
  - Consistent response structure: `success`, `code`, `message`, optional `data`
  - i18n support: returns messages in the correct locale
  - Optional `requestId` tracking if available in `req`
  - Automatically uses the HTTP status code from your message configuration
  - Prevents duplicate responses if headers were already sent

---

### **Example Response**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Request successful",
  "data": {
    "id": "123456",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "requestId": "abc-123" // optional
}
```

```json
{
  "success": false,
  "code": "DATA_NOT_FOUND",
  "message": "Data not found",
  "requestId": "abc-124"
}
```

---

✅ **Tip:** Always use `ResponseUtil.send` for all success and error responses. Combine it with **AsyncRouteWrapper** for async functions to ensure unhandled errors are automatically propagated to your global error handler.

# 🛠 Utilities

`express-pack` provides **ready-to-use backend utilities**.
This section covers **Encryption** and **JWT Token Management**.

---

## **1️⃣ Encryption Utility**

`EncryptionUtil` helps secure passwords, API keys, and sensitive data.

### **Usage Examples**

```javascript
import { EncryptionUtil } from "express-pack";

// Hash a password
const hashedPassword = await EncryptionUtil.hash({
  password: "mySecurePassword123!",
  saltRounds: 12, // optional, default 10
});

// Compare password with hash
const isValid = await EncryptionUtil.compare({
  password: "mySecurePassword123!",
  hashed: hashedPassword,
});

// Encrypt a text
const encryptedText = EncryptionUtil.encrypt({
  text: "Hello World!",
  key: process.env.ENCRYPTION_KEY, // optional, default 32-byte env key
});

// Decrypt a text
const decryptedText = EncryptionUtil.decrypt({
  encryptedText,
  key: process.env.ENCRYPTION_KEY, // optional
});
```

### **Function Reference**

| Function  | Parameters                                  | Description                                                                         |
| --------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `hash`    | `{ password: string, saltRounds?: number }` | Hash a password using bcrypt. `saltRounds` defaults to 10.                          |
| `compare` | `{ password: string, hashed: string }`      | Compare a plaintext password with a hash.                                           |
| `encrypt` | `{ text: string, key?: string }`            | Encrypt a string using AES-256-CBC. `key` defaults to `process.env.ENCRYPTION_KEY`. |
| `decrypt` | `{ encryptedText: string, key?: string }`   | Decrypt a previously encrypted string using the same key.                           |

---

## **2️⃣ JWT Utility**

`JWTUtil` provides **JWT token generation, verification, decoding, and refresh**.

### **Usage Examples**

```javascript
import { JWTUtil } from "express-pack";

// Generate access and refresh tokens
const { accessToken, refreshToken } = await JWTUtil.generateTokens({
  tokenPayload: {
    payload: { userId: "123", role: "admin" },
    JWT_SECRET: process.env.JWT_SECRET,
    expiresIn: "1h", // optional, default "25m"
  },
  refreshTokenPayload: {
    expiresIn: "7d",
    REFRESH_SECRET: process.env.REFRESH_SECRET,
  }, // optional
  generateRefreshToken: true,
});

// Verify access token
const decodedPayload = await JWTUtil.verify({
  token: accessToken,
  JWT_SECRET: process.env.JWT_SECRET,
});

// Decode token without verification
const tokenInfo = JWTUtil.decode({ token: accessToken });

// Verify refresh token
const refreshPayload = await JWTUtil.verifyRefreshToken({
  token: refreshToken,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
});

// Refresh access token using a refresh token
const newTokens = await JWTUtil.refreshAccessToken({
  token: refreshToken,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
});
```

### **Function Reference**

| Function             | Parameters                                                      | Description                                                                                                    |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `generateTokens`     | `{ tokenPayload, refreshTokenPayload?, generateRefreshToken? }` | Generates access token and optionally a refresh token. `tokenPayload` must include `payload` and `JWT_SECRET`. |
| `verify`             | `{ token: string, JWT_SECRET: string }`                         | Verifies an access token. Throws error if expired or invalid.                                                  |
| `decode`             | `{ token: string }`                                             | Decodes a token without verifying its signature.                                                               |
| `verifyRefreshToken` | `{ token: string, REFRESH_SECRET: string }`                     | Verifies a refresh token. Throws error if invalid.                                                             |
| `refreshAccessToken` | `{ token, REFRESH_SECRET, JWT_SECRET }`                         | Generates a new access token using a valid refresh token.                                                      |

---

✅ **Developer Notes:**

- **EncryptionUtil**: Use for passwords, API keys, or sensitive fields. Always use a **secure key** for encryption.
- **JWTUtil**: Standardize authentication flow with **access & refresh tokens**. Keep secrets in **environment variables**.

---

## 3️⃣ Lodash Helper

`LodashHelper` is a **utility wrapper around lodash** for safe object manipulation, deep cloning, array handling, and debouncing.

It provides **clean, type-safe functions** to simplify common operations on objects and arrays.

---

### **Usage Examples**

```javascript
import { LodashHelper } from "express-pack";

// Get value safely from object
const user = { name: { first: "John", last: "Doe" } };
const firstName = LodashHelper.get(user, "name.first"); // "John"
const middleName = LodashHelper.get(user, "name.middle", "N/A"); // "N/A"

// Set value in object
LodashHelper.set(user, "name.middle", "Michael");

// Merge multiple objects
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = LodashHelper.merge(obj1, obj2); // { a:1, b:3, c:4 }

// Deep clone an object
const clonedUser = LodashHelper.cloneDeep(user);

// Check if object or array is empty
const isEmpty = LodashHelper.isEmpty({}); // true

// Pick and omit object keys
const picked = LodashHelper.pick(user, ["name.first"]); // { name: { first: "John" } }
const omitted = LodashHelper.omit(user, ["name.last"]); // { name: { first: "John" } }

// Unique array by key
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 1, name: "A" },
];
const uniqueUsers = LodashHelper.uniqBy(users, "id");

// Debounce function
const log = () => console.log("Called");
const debouncedLog = LodashHelper.debounce(log, 500);

// Get value or default
const age = LodashHelper.getOrDefault(user, "profile.age", 18);

// Check if multiple nested keys exist
const hasKeys = LodashHelper.hasNestedKeys(user, ["name.first", "name.last"]); // true

// Deep clone and set a value
const updatedDeep = LodashHelper.deepCloneAndSet(
  user,
  "name.middle",
  "Michael"
);

// Compact object (remove null, undefined, or empty strings)
const compacted = LodashHelper.compactObject({ a: 1, b: null, c: "" }); // { a: 1 }
```

---

### **Function Reference**

| Function          | Parameters                                                  | Description                                         |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| `get`             | `(obj: AnyObject, path: string, defaultVal?: any)`          | Safely get value at a path in an object.            |
| `set`             | `(obj: AnyObject, path: string, value: any)`                | Set value at a path in an object.                   |
| `merge`           | `(target: AnyObject, ...sources: AnyObject[])`              | Deep merge multiple objects.                        |
| `cloneDeep`       | `(value: any)`                                              | Deep clone an object or array.                      |
| `isEmpty`         | `(value: any)`                                              | Check if value is empty (object, array, string).    |
| `omit`            | `(obj: AnyObject, keys: string[])`                          | Remove specified keys from object.                  |
| `pick`            | `(obj: AnyObject, keys: string[])`                          | Pick only specified keys from object.               |
| `uniqBy`          | `(array: any[], key: string)`                               | Return unique array elements by a key.              |
| `debounce`        | `(func: Function, wait: number, options?: DebounceOptions)` | Debounce a function call to limit execution rate.   |
| `getOrDefault`    | `(obj: AnyObject, path: string, defaultVal?: any)`          | Get value or fallback default if path undefined.    |
| `hasNestedKeys`   | `(obj: AnyObject, paths: string[])`                         | Check if all nested keys exist in object.           |
| `deepCloneAndSet` | `(obj: AnyObject, path: string, value: any)`                | Deep clone an object and set a value at a path.     |
| `compactObject`   | `(obj: AnyObject)`                                          | Remove null, undefined, or empty string properties. |

---

✅ **Developer Notes:**

- Use `LodashHelper` for **safe and immutable object operations**.
- Supports **deep paths**, **default values**, and **array uniqueness checks**.
- `debounce` is ideal for **rate-limiting functions** in APIs, CLI scripts, or front-end events.

---

## 4️⃣ Date Utilities (`DateUtil*`)

The `DateUtil` collection provides **robust, type-safe, and timezone-aware date manipulations**, comparisons, formatting, and validations. Each utility class focuses on a **specific aspect of date handling**, making your code cleaner and reducing boilerplate.

---

### 4.1 Business Day Utilities (`DateUtilBusiness`)

Utilities for **working with business days and holidays**.

#### **Usage**

```javascript
import { DateUtilBusiness } from "express-pack";

const date = new Date("2025-10-25");

// Check if a date is a business day
const isBusiness = DateUtilBusiness.isBusinessDay(date);

// Get the next business day
const nextBusiness = DateUtilBusiness.nextBusinessDay(date);

// Add N business days
const newDate = DateUtilBusiness.addBusinessDays(date, 5);

// Check for holidays
const holidays = [new Date("2025-10-31")];
const isHoliday = DateUtilBusiness.isHoliday(date, holidays);

// Get Nth weekday of a month (e.g., 2nd Tuesday of October 2025)
const secondTuesday = DateUtilBusiness.getNthWeekdayInMonth(2, 2, 9, 2025); // month is 0-based
```

---

### 4.2 Comparison Utilities (`DateUtilCompare`)

Utilities for **comparing dates at different granularities**.

#### **Usage**

```javascript
import { DateUtilCompare } from "express-pack";

const date1 = new Date("2025-10-25T10:00:00");
const date2 = new Date("2025-10-25T15:00:00");

// Compare dates
const before = DateUtilCompare.isBefore(date1, date2, "hour");
const after = DateUtilCompare.isAfter(date2, date1, "day");
const same = DateUtilCompare.isSame(date1, date2, "day");

// Compare numerically
const cmp = DateUtilCompare.compare(date1, date2);

// Check if date is between two others
const between = DateUtilCompare.isBetween(date1, date2, new Date("2025-10-26"));
```

---

### 4.3 Date Creation Utilities (`DateUtilCreate`)

Create dates from **strings, ISO, Unix timestamps, parts, or timezone-aware inputs**.

#### **Usage**

```javascript
import { DateUtilCreate } from "express-pack";

// Create from formatted string
const dt1 = DateUtilCreate.create({
  value: "25-10-2025",
  format: "dd-MM-yyyy",
});

// Current timestamp in timezone
const now = DateUtilCreate.now("Asia/Kolkata");

// From Unix timestamp
const fromUnix = DateUtilCreate.fromUnix(1740000000);

// From ISO string
const fromISO = DateUtilCreate.fromISOString("2025-10-25T10:00:00Z");

// From parts
const fromParts = DateUtilCreate.fromParts({
  year: 2025,
  month: 10,
  day: 25,
  hour: 10,
  minute: 30,
  timezone: "UTC",
});
```

---

### 4.4 Duration Utilities (`DateUtilDuration`)

Calculate **differences, durations, weekdays, and relative times**.

#### **Usage**

```javascript
import { DateUtilDuration } from "express-pack";

const start = new Date("2025-10-25T10:00:00");
const end = new Date("2025-10-27T15:30:00");

// Difference in days or hours
const diffDays = DateUtilDuration.diff(start, end, "days");
const diffHoursFloat = DateUtilDuration.diff(start, end, "hours", true);

// Breakdown duration into days, hours, minutes, seconds
const breakdown = DateUtilDuration.duration(start, end);

// Relative time from now
const fromNowStr = DateUtilDuration.fromNow(start);

// Count weekdays between two dates
const weekdays = DateUtilDuration.countWeekdays(start, end);
```

---

### 4.5 Edge Case Utilities (`DateUtilEdgeCase`)

Handle **invalid dates, fallback, ambiguous DST, min/max dates**.

#### **Usage**

```javascript
import { DateUtilEdgeCase } from "express-pack";

const invalidDate = new Date("invalid");

// Fallback for invalid date
const safeDate = DateUtilEdgeCase.handleInvalidFallback(
  invalidDate,
  new Date()
);

// Normalize any input to Date
const normalized = DateUtilEdgeCase.normalizeDateInput("2025-10-25");

// Maximum and minimum dates
const maxDate = DateUtilEdgeCase.getMaxDate(new Date(), new Date("2025-12-31"));
const minDate = DateUtilEdgeCase.getMinDate(new Date(), new Date("2025-01-01"));

// Check ambiguous DST
const isDSTAmbiguous = DateUtilEdgeCase.isAmbiguousDST(new Date());
```

---

### 4.6 Formatting Utilities (`DateUtilFormat`)

Format and convert dates to **ISO, Unix, JSON, locale strings, and offsets**.

#### **Usage**

```javascript
import { DateUtilFormat } from "express-pack";

const date = new Date("2025-10-25T10:00:00");

// Custom format
const formatted = DateUtilFormat.formatDate(date, "dd/MM/yyyy HH:mm");

// ISO string
const iso = DateUtilFormat.toISOString(date);

// Unix timestamp
const unix = DateUtilFormat.toUnix(date);

// JSON string
const jsonStr = DateUtilFormat.toJSON(date);

// Locale string
const localeStr = DateUtilFormat.toLocaleString(date, "en-GB");

// Timezone offset
const offset = DateUtilFormat.getOffset(date);
```

---

### 4.7 Manipulation Utilities (`DateUtilManipulate`)

Add, subtract, set, or clone dates; get **start or end of units**.

#### **Usage**

```javascript
import { DateUtilManipulate } from "express-pack";

const date = new Date("2025-10-25T10:00:00");

// Add/subtract time units
const nextWeek = DateUtilManipulate.add(date, 1, "weeks");
const prevMonth = DateUtilManipulate.subtract(date, 1, "months");

// Set specific parts
const setYearDate = DateUtilManipulate.set(date, "year", 2030);

// Start/end of units
const startOfMonth = DateUtilManipulate.startOf(date, "month");
const endOfYear = DateUtilManipulate.endOf(date, "year");

// Clone date
const clone = DateUtilManipulate.clone(date);
```

---

### 4.8 Range Utilities (`DateUtilsRange`)

Work with **date ranges**, chunk ranges, intersect or merge.

#### **Usage**

```javascript
import { DateUtilsRange } from "express-pack";

const start = new Date("2025-10-01");
const end = new Date("2025-10-31");

// Get all dates in range
const range = DateUtilsRange.getDateRange(start, end);

// Chunk by unit
const weeks = DateUtilsRange.chunkBy(range, "week");

// Check intersection of ranges
const intersect = DateUtilsRange.intersectRanges(
  [start, end],
  [new Date("2025-10-15"), new Date("2025-11-01")]
);

// Merge multiple ranges
const merged = DateUtilsRange.mergeRanges([
  [start, new Date("2025-10-10")],
  [new Date("2025-10-05"), end],
]);
```

---

### 4.9 Timezone Utilities (`DateUtilTimezone`)

Convert dates to **different timezones, get offsets, and localized strings**.

#### **Usage**

```javascript
import { DateUtilTimezone } from "express-pack";

const date = new Date();

// Convert to timezone
const indiaTime = DateUtilTimezone.convertToTZ(date, "Asia/Kolkata");

// Current timezone
const tz = DateUtilTimezone.getTimezone();

// Format with locale
const localeDate = DateUtilTimezone.withLocale(date, "fr-FR");

// Timezone abbreviation
const tzAbbr = DateUtilTimezone.getTimezoneAbbr(date);

// Offset in minutes
const offsetMinutes = DateUtilTimezone.getTimezoneOffsetMinutes(date);
```

---

### 4.10 Validation Utilities (`DateUtilValidate`)

Validate **dates, leap years, DST, weekends, same-day checks**.

#### **Usage**

```javascript
import { DateUtilValidate } from "express-pack";

// Validate date
const valid = DateUtilValidate.isValid("2025-10-25");

// Parse date from formats
const parsed = DateUtilValidate.parseDate("25-10-2025", ["dd-MM-yyyy"]);

// Leap year check
const leap = DateUtilValidate.isLeapYear(2024);

// DST and weekend check
const dst = DateUtilValidate.isDST(new Date());
const weekend = DateUtilValidate.isWeekend(new Date());

// Same day comparison
const sameDay = DateUtilValidate.isSameDay(
  new Date("2025-10-25"),
  new Date("2025-10-25")
);
```

---

✅ **Developer Notes:**

- Each `DateUtil*` class is **focused and type-safe**, designed for **real-world date handling**, including **business days, duration, ranges, formatting, manipulation, timezones, and validations**.
- Timezone handling relies on `date-fns-tz` for **accurate conversions**.
- Edge cases like **invalid dates, ambiguous DST, and leap years** are supported out-of-the-box.

---

## 🤝 Acknowledgments

I would like to express my sincere gratitude to everyone who inspired and contributed to the creation of **express-pack**.

- **Open Source Libraries & Tools**: This project leverages and is inspired by numerous open-source libraries such as **Express.js**, **MongoDB**, **Redis**, and **RabbitMQ**. Without the hard work and dedication of these communities, this library wouldn’t have been possible.
- **Mentors & Collaborators**: Special thanks to my mentors, colleagues, and fellow developers who provided guidance, feedback, and encouragement throughout the development of this project.
- **Community Inspiration**: The Node.js and backend development communities have been a constant source of learning, motivation, and innovation. Your contributions helped shape the ideas behind this library.
- **Family & Friends**: Thank you for your patience, support, and understanding during the development process.

This project is built on the shoulders of giants, and I hope **express-pack** will, in turn, help developers build scalable and maintainable backend applications with ease.
