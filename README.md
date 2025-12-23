# express-pack

![Express-Pack Logo](https://i.ibb.co/1t1zKdvf/express-pack-logo-1-1-2.png) <!-- Replace with actual logo if available -->
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

[![npm version](https://img.shields.io/npm/v/express-pack.svg)](https://www.npmjs.com/package/express-pack)
[![License](https://img.shields.io/npm/l/express-pack.svg)](https://github.com/your-repo/express-pack/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/express-pack)](https://www.npmjs.com/package/express-pack)
[![Documentation](https://img.shields.io/badge/docs-typedoc-blue)](https://muthu-kumar369.github.io/express-pack/)

`express-pack`is a modular and scalable utility library built to enhance and simplify Express.js backend development. It provides ready-to-use features such as multi-tenant handling, request validation, authentication, authorization, scoped queries, job scheduling, caching, and messaging integrations — all implemented with clean design patterns and developer flexibility in mind.

It’s designed to reduce boilerplate code and bring enterprise-grade patterns (middleware orchestration, service wrappers, extensibility hooks, retry handlers, scoped query management, etc.) to everyday Express projects.

---

## 📖 Table of Contents

1. [🚀 Key Features](#-key-features)
2. [📦 Installation](#-installation)
3. [🔄 Migration Guide (v1 → v2)](#-migration-guide-v1--v2)
4. [🎯 Quick Start](#-quick-start)
5. [📂 Project Structure & Usage](#-project-structure--usage)
6. [⚙️ Configuration](#-configuration)

   - [App Configuration](#1️⃣-app-configuration-appconfigjs)
   - [Route Configuration](#2️⃣-route-configuration-routeconfigjs)
   - [Message Configuration](#3️⃣-message-configuration-messageconfigjs)
   - [Locale Configuration](#4️⃣-locale-configuration-localeenconfigjs)

7. [🟢 Initialization & Usage](#-initialization--usage)
8. [🔷 TypeScript Support](#-typescript-support)
9. [🛠 Third-Party Integrations](#-third-party-integrations)

   - [Redis Client](#1-redis-client)
   - [RabbitMQ Service](#2-rabbitmq-service)
   - [Cron Manager](#3-cron-manager)

10. [🛠 Using in Routes](#-using-express-pack-in-routes)
11. [📝 Mongoose Schema & Plugins](#-mongoose-schema--plugins)
12. [📤 API Responses](#-using-responseutil-for-consistent-api-responses)
13. [🔷 TypeScript Support](#-typescript-support)
14. [📖 OpenAPI/Swagger Integration](#-openapiswagger-integration)
15. [🧰 Utilities](#-utilities)
16. [⚡ Performance Optimization](#-performance-optimization)
17. [✅ Best Practices & Anti-Patterns](#-best-practices--anti-patterns)
18. [🔧 Troubleshooting](#-troubleshooting)
19. [📚 Examples](#-examples)
20. [🤝 Acknowledgments](#-acknowledgments)

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

---

## 🔄 Migration Guide (v1 → v2)

Upgrading from v1.x to v2.0.0? We've got you covered!

v2.0.0 is a major rewrite with full TypeScript support, ESM modules, and improved APIs. While there are breaking changes, migration is straightforward.

### Quick Migration

```bash
# 1. Update package.json
npm install express-pack@^2.0.0 express@^4.0.0

# 2. Use automated migration tool
node node_modules/express-pack/scripts/migrate-v1-to-v2.js

# 3. Follow the prompts and test your app
npm test
```

### Key Changes

- ✅ **ESM Modules** - Use `import` instead of `require`
- ✅ **Async Init** - `await ExpressPack.init({ app, config })`
- ✅ **TypeScript** - Full type safety (optional)
- ✅ **Object Parameters** - Better API design

### Full Migration Guide

📖 **[Read the complete migration guide](./MIGRATION.md)** for:
- Detailed breaking changes
- Step-by-step instructions
- Common issues & solutions
- Rollback procedures

---

## 🎯 Quick Start

Get up and running with **express-pack** in under 5 minutes.

### **1. Install Dependencies**

```bash
npm install express-pack express
```

### **2. Create Your App**

Create a `src/app.ts` file:

```typescript
import { ExpressPack, ErrorHandler, type MiddlewareConfig } from 'express-pack';
import express, { type Application } from 'express';

// Define middleware configuration with type safety
const config: MiddlewareConfig = {
  cors: { origin: '*' },
  bodyParser: { json: { limit: '10mb' } },
  logger: { level: 'info' },
};

// Initialize Express app
const app: Application = express();

// Initialize express-pack
await ExpressPack.init({ app, config });

// Add a health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add global error handlers
app.use(ErrorHandler.handleGlobalError);
app.use(ErrorHandler.handleNotFoundRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### **3. Run Your App**

```bash
npx tsx src/app.ts
```

### **4. Test It**

```bash
curl http://localhost:3000/health
# Response: {"status":"ok","timestamp":"2025-12-23T03:08:06.000Z"}
```

🎉 **That's it!** You now have a fully configured Express app with CORS, body parsing, logging, and error handling.

**Next Steps:**
- Add [routes and validation](#-using-express-pack-in-routes)
- Configure [database connections](#-mongoose-schema--plugins)
- Set up [Redis caching](#1-redis-client)
- Explore [TypeScript support](#-typescript-support)

---

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

### 1️⃣ App Configuration (`appConfig.ts`)

Controls app-level settings like CORS, logger, security, compression, and rate limiting.

```typescript
import type { MiddlewareConfig } from 'express-pack';

const appConfig: MiddlewareConfig = {
  env: "development",
  cors: {
    origin: '*',
    credentials: true,
  },
  logger: {
    level: 'info',
  },
  bodyParser: {
    json: { limit: '10mb' },
    urlencoded: { extended: true },
  },
  security: {
    hsts: { maxAge: 31536000 },
  },
  compression: {
    level: 6,
    threshold: 1024,
  },
  'express-rate-limit': {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};

export default appConfig;
```

---

### 2️⃣ Route Configuration (`routeConfig.ts`)

Defines API routes, prefixes, and versions. Each route references its corresponding module router.

```typescript
import type { RouteGroup } from 'express-pack';
import addressRouter from '../modules/user/address/router/address.router';
import cartRouter from '../modules/user/cart/router/cart.router';
import notificationRouter from '../modules/user/notification/router/notification.router';
import userRouter from '../modules/user/user/router/user.router';

interface RouteConfig {
  routes: RouteGroup[];
}

const routeConfig: RouteConfig = {
  routes: [
    {
      prefix: '/api',
      version: '/v1',
      route: [
        { path: '/address', route: addressRouter },
        { path: '/cart', route: cartRouter },
        { path: '/notification', route: notificationRouter },
        { path: '/user', route: userRouter },
      ],
    },
  ],
};

export default routeConfig;
```

---

### 3️⃣ Message Configuration (`messageConfig.ts`)

Standardized messages for API responses.

```typescript
interface MessageConfig {
  http_code: number;
  code: string;
  success: boolean;
}

interface Messages {
  [key: string]: MessageConfig;
}

const messageConfig: Messages = {
  INTERNAL_SERVER_ERROR: {
    http_code: 500,
    code: 'INTERNAL_SERVER_ERROR',
    success: false,
  },
  DATA_NOT_FOUND: {
    http_code: 400,
    code: 'DATA_NOT_FOUND',
    success: false,
  },
  SUCCESS: {
    http_code: 200,
    code: 'SUCCESS',
    success: true,
  },
  PASSWORD_MISMATCH: {
    http_code: 400,
    code: 'PASSWORD_MISMATCH',
    success: false,
  },
  USER_ALREADY_EXIST: {
    http_code: 400,
    code: 'USER_ALREADY_EXIST',
    success: false,
  },
  REGISTER_SUCCESS: {
    http_code: 200,
    code: 'REGISTER_SUCCESS',
    success: true,
  },
};

export default messageConfig;
```

---

### 4️⃣ Locale Configuration (`localeEnConfig.ts`)

English translation strings.

```typescript
interface LocaleTranslations {
  [key: string]: string;
}

const localeEnConfig: LocaleTranslations = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATA_NOT_FOUND: 'Data not found',
  SUCCESS: 'Request successful',
  PASSWORD_MISMATCH: 'Password is incorrect',
  USER_ALREADY_EXIST: 'User already exists',
  REGISTER_SUCCESS: 'User registered successfully',
};

export default localeEnConfig;
```

---

## 🟢 Initialization & Usage

All initialization is centralized in `src/loaders/index.ts` for modular setup.

```typescript
import { ExpressPack, ErrorHandler, i18n, Mongoose } from 'express-pack';
import express, { type Application } from 'express';

import appConfig from '../config/appConfig';
import routesConfig from '../config/routeConfig';
import messageConfig from '../config/messages/messageConfig';
import localeEnConfig from '../config/locale/en/localeEnConfig';

import RedisService from '../services/redis';
import RabbitMQService from '../services/queue/rabbitmq';
import CronService from '../services/cron';

export const initializeApp = async (): Promise<Application> => {
  // Handle uncaught exceptions and unhandled rejections
  ErrorHandler.handleProcessError();

  // Initialize ExpressPack
  const app: Application = express();
  await ExpressPack.init({ app, config: appConfig });

  // Initialize database
  await Mongoose.init({ uri: process.env.DB_URL! });

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

### `index.ts` Example

```typescript
import { initializeApp } from './src/loaders';

const PORT = process.env.PORT || 3000;

(async () => {
  const app = await initializeApp();
  app.listen(PORT, () => {
    console.log(`✅ App is running on port ${PORT}`);
  });
})();
```

---

## 🔷 TypeScript Support

**express-pack** is built with **TypeScript-first** design, providing comprehensive type definitions for all features.

### **Type Exports Reference**

All types are exported from the main package:

```typescript
import type {
  // Configuration Types
  MiddlewareConfig,
  RouteGroup,
  RouteDefinition,
  
  // Authentication Types
  AuthConfig,
  JWTPayload,
  
  // Validation Types
  ValidationSchema,
  
  // Response Types
  ResponseFormat,
  ApiResponse,
  
  // Mongoose Plugin Types
  ModelBuildConfig,
  PluginConfig,
  PaginateOptions,
  PaginateResult,
  
  // Service Types
  RedisConfig,
  RabbitMQConfig,
  CronConfig,
  
  // Utility Types
  DateInput,
  TimeUnit,
  DurationUnit,
  AnyObject,
} from 'express-pack';
```

### **Generic Type Usage**

Many utilities support generic types for type-safe operations:

```typescript
import { RabbitMQService, type MessageHandler } from 'express-pack';

// Type-safe message handler
interface OrderMessage {
  orderId: string;
  userId: string;
  amount: number;
}

const handleOrder: MessageHandler<OrderMessage> = async (msg) => {
  // msg is typed as OrderMessage
  console.log(`Processing order ${msg.orderId} for user ${msg.userId}`);
};

await RabbitMQService.consume<OrderMessage>('orders', handleOrder);
```

### **Type-Safe Configuration**

Use type definitions for compile-time configuration validation:

```typescript
import type { MiddlewareConfig, RouteGroup } from 'express-pack';

// Type-safe middleware config
const config: MiddlewareConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    // TypeScript will error if you add invalid properties
  },
  bodyParser: {
    json: { limit: '10mb' },
    urlencoded: { extended: true },
  },
  logger: {
    level: 'info', // Type-safe: only valid log levels allowed
  },
};

// Type-safe route configuration
const routes: RouteGroup[] = [
  {
    prefix: '/api',
    version: '/v1',
    route: [
      { path: '/users', route: userRouter },
      // TypeScript ensures correct structure
    ],
  },
];
```

### **Custom Type Extensions**

Extend Express types to include custom properties:

```typescript
import type { Request } from 'express';

// Extend Express Request interface
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'user' | 'admin' | 'seller';
    };
    tenant?: {
      id: string;
      name: string;
    };
    requestId?: string;
  }
}

// Now you can use these properties with full type safety
import { AsyncRouteWrapper } from 'express-pack';

const getProfile = AsyncRouteWrapper.asyncHandler(async (req, res) => {
  // req.user is fully typed
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId: string = req.user.id; // Type-safe access
  const userRole: 'user' | 'admin' | 'seller' = req.user.role;
  
  res.json({ userId, userRole });
});
```

### **Type Inference Examples**

TypeScript automatically infers types in many scenarios:

```typescript
import { ModelBuilder, z } from 'express-pack';

// Define schema with type inference
const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number },
  role: { type: String, enum: ['user', 'admin'] },
};

// Build model - TypeScript infers the document type
const User = ModelBuilder.build({
  name: 'user',
  schemaDefinition: userSchema,
  plugins: {
    timestamps: true,
    softDelete: true,
  },
});

// Type inference in queries
const user = await User.findOne({ email: 'test@example.com' });
// user is automatically typed with name, email, age, role, createdAt, updatedAt

// Type-safe validation with Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginInput = z.infer<typeof loginSchema>; // Inferred type
// LoginInput = { email: string; password: string; }
```

### **Common TypeScript Errors & Solutions**

#### **Error: Type 'undefined' is not assignable to type 'string'**

**Cause:** Accessing environment variables without null checking.

**Solution:**
```typescript
// ❌ Wrong
const dbUrl: string = process.env.DB_URL;

// ✅ Correct - Option 1: Non-null assertion (if you're sure it exists)
const dbUrl: string = process.env.DB_URL!;

// ✅ Correct - Option 2: Provide default
const dbUrl: string = process.env.DB_URL || 'mongodb://localhost:27017/db';

// ✅ Correct - Option 3: Runtime validation
if (!process.env.DB_URL) {
  throw new Error('DB_URL environment variable is required');
}
const dbUrl: string = process.env.DB_URL;
```

#### **Error: Property 'user' does not exist on type 'Request'**

**Cause:** Custom properties not declared in Express types.

**Solution:**
```typescript
// Add type declaration (see Custom Type Extensions above)
declare module 'express' {
  interface Request {
    user?: User;
  }
}
```

#### **Error: Argument of type 'X' is not assignable to parameter of type 'Y'**

**Cause:** Type mismatch in function calls.

**Solution:**
```typescript
import type { MiddlewareConfig } from 'express-pack';

// ❌ Wrong - missing type annotation
const config = {
  cors: { origin: '*' },
};

// ✅ Correct - explicit type
const config: MiddlewareConfig = {
  cors: { origin: '*' },
};
```

#### **Error: Cannot find module 'express-pack' or its corresponding type declarations**

**Cause:** Package not installed or types not recognized.

**Solution:**
```bash
# Reinstall package
npm install express-pack

# Clear TypeScript cache
rm -rf node_modules/.cache
npx tsc --build --clean
```

---

# 📌 Configuration Options

### **Body Parser Configuration**

Handles request body parsing.

| Option       | Default Value                                          | Description               |
| ------------ | ------------------------------------------------------ | ------------------------- |
| `json`       | `{ limit: "100kb" }`                                   | Limits JSON body size     |
| `urlencoded` | `{ extended: true, limit: "100kb" }`                   | Parses URL-encoded bodies |
| `raw`        | `{ type: "application/octet-stream", limit: "100kb" }` | Parses raw binary data    |
| `text`       | `{ type: "text/plain", limit: "100kb" }`               | Parses plain text         |

**Example Usage:**

```typescript
import type { MiddlewareConfig } from 'express-pack';

const config: MiddlewareConfig = {
  bodyParser: {
    json: { limit: '1mb' },
    urlencoded: { extended: true, limit: '500kb' },
  },
};
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

```typescript
import type { MiddlewareConfig } from 'express-pack';

const config: MiddlewareConfig = {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
  },
};
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

```typescript
import type { MiddlewareConfig } from 'express-pack';
import { transports } from 'winston';

const config: MiddlewareConfig = {
  logger: {
    level: 'debug',
    transports: [new transports.Console()],
  },
};
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

```typescript
import type { MiddlewareConfig } from 'express-pack';

const config: MiddlewareConfig = {
  security: {
    hsts: { maxAge: 31536000 },
    xssFilter: false,
  },
};
```

### **Compression Configuration**

Optimizes server performance by compressing HTTP responses.

| Option      | Default Value | Description                                                                       |
| ----------- | ------------- | --------------------------------------------------------------------------------- |
| `level`     | `6`           | Compression level (0-9) for Gzip. Higher values result in better compression.     |
| `threshold` | `1024`        | Only compress responses larger than 1KB. Smaller responses are sent uncompressed. |
| `filter`    | `Function`    | A function to determine whether to apply compression based on request/response.   |

**Example Usage:**

```typescript
import type { MiddlewareConfig } from 'express-pack';
import type { Request, Response } from 'express';
import compression from 'compression';

const config: MiddlewareConfig = {
  compression: {
    level: 9,
    threshold: 2048,
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false; // Skip compression if client requests no compression
      }
      return compression.filter(req, res); // Default compression filter
    },
  },
};
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

```typescript
import type { MiddlewareConfig } from 'express-pack';

const config: MiddlewareConfig = {
  'express-rate-limit': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                   // limit each IP to 50 requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
};
```

# **🛠 Third-Party Integrations**

`express-pack` provides ready-to-use integrations for **Redis**, **RabbitMQ**, and **Cron jobs**, making backend development faster and cleaner.

---

## **1. Redis Client**

### **⚡ Initialization / Connection**

```typescript
import { RedisClientService, type RedisConfig } from 'express-pack';

const ConnectRedis = (): void => {
  const config: RedisConfig = {
    REDIS_HOST: '127.0.0.1',
    REDIS_PORT: 6379,
    REDIS_PASSWORD: 'yourpassword',
    REDIS_DB: 0,
  };
  
  RedisClientService.enableRedis(true, config);
};

export default ConnectRedis;
```

### **🚀 Usage Examples**

```typescript
import { RedisClientService } from 'express-pack';

// 💾 Set key with optional expiration
await RedisClientService.set('key1', 'value1');
await RedisClientService.set('key2', 'value2', { expire: 60 }); // expires in 60 sec

// 🔍 Get key
const value: string | null = await RedisClientService.get('key1');

// ❌ Delete key
await RedisClientService.del('key2');

// ⏳ Set expiration
await RedisClientService.expire('key1', 120); // expire in 120 sec

// 🗂 List keys
const keys: string[] = await RedisClientService.keys('*');

// 🧩 Get Redis client instance
const client = RedisClientService.getClient();
```

---

## **2. RabbitMQ Service**

### **⚡ Initialization / Connection**

```typescript
import { RabbitMQService, type RabbitMQConfig } from 'express-pack';

const ConnectRabbitMQ = async (): Promise<void> => {
  const config: RabbitMQConfig = {
    enabled: true,
    uri: 'amqp://user:password@localhost:5672',
    prefetch: 5,
    exchanges: [
      { name: 'logs', type: 'fanout' },
    ],
    queues: [
      { name: 'task_queue', options: { durable: true } },
    ],
  };

  await RabbitMQService.init(config);
};

export default ConnectRabbitMQ;
```

### **🚀 Usage Examples**

```typescript
import { RabbitMQService, type MessageHandler } from 'express-pack';

interface TaskMessage {
  task: string;
  data?: any;
}

// 📤 Publish to exchange
await RabbitMQService.publishToExchange('logs', '', { message: 'Hello' });

// 📥 Publish to queue
const taskMessage: TaskMessage = { task: 'send_email', data: { to: 'user@example.com' } };
await RabbitMQService.publishToQueue('task_queue', taskMessage);

// 🎧 Consume messages from a queue with type safety
const handleTask: MessageHandler<TaskMessage> = async (msg) => {
  console.log('Received task:', msg.task);
  // Process task...
};

await RabbitMQService.consume<TaskMessage>(
  'task_queue',
  handleTask,
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

```typescript
import { CronManager, RedisClientService, type CronConfig } from 'express-pack';
import type { Redis } from 'ioredis';

const InitCronManager = (): CronManager => {
  const redisClient: Redis = RedisClientService.getClient();
  
  const config: CronConfig = {
    serviceName: 'my-service',
    redis: redisClient,
    persistent: true,
    timezone: 'Asia/Kolkata',
    persistService: 'redis', // or 'mongodb'
  };
  
  const cron = new CronManager(config);
  return cron;
};

export default InitCronManager;
```

### **🚀 Usage Examples**

```typescript
import type { CronJobConfig } from 'express-pack';

const cron = InitCronManager();

interface JobPayload {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

// 🆕 Register a cron job
const jobConfig: JobPayload = {
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'GET',
};

cron.registerJob(
  'test-job',
  '*/1 * * * *', // every 1 minute
  jobConfig,
  { runOnInit: true, retry: 2 }
);

// ⏸ Pause a job
cron.pauseJob('test-job');

// ▶️ Resume a job
cron.resumeJob('test-job');

// 🛑 Stop a job
cron.stopJob('test-job');

// ❌ Remove a job
await cron.removeJob('test-job');

// 📄 List all registered jobs
const jobs = cron.listJobs();
console.log(jobs);

// 🔍 Track job state manually
const state = await cron.getJobState('test-job');
await cron.trackJobState('test-job', 'running');
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

```typescript
// src/routes/user.router.ts
import {
  ExpressPack,
  RequestValidator,
  AuthMiddleware,
  AsyncRouteWrapper,
} from 'express-pack';
import type { Router } from 'express';

import {
  login,
  register,
  userDelete,
  userProfileDetails,
} from '../controller/user.controller';

import UserHelper from '../helper/user.helper';

// Import pre-defined route config
import { userRoutesConfig } from '../config/routes/userRoutesConfig';

const router: Router = ExpressPack.getRouter();

// ===============================
// Routes
// ===============================

// Login route
router.post(
  '/login',
  RequestValidator.validateRequest(userRoutesConfig.login.validation),
  AsyncRouteWrapper.asyncHandler(login)
);

// Register route
router.post(
  '/register',
  RequestValidator.validateRequest(userRoutesConfig.register.validation),
  AsyncRouteWrapper.asyncHandler(register)
);

// Profile details
router.get(
  '/profile-details',
  AuthMiddleware.authenticateUser(userRoutesConfig.profile.auth),
  AsyncRouteWrapper.asyncHandler(userProfileDetails)
);

// Delete user by ID
router.delete(
  '/:user_id',
  AuthMiddleware.authenticateUser(userRoutesConfig.delete.auth),
  RequestValidator.validateRequest(userRoutesConfig.delete.validation),
  AsyncRouteWrapper.asyncHandler(userDelete)
);

export default router;
```

---

### **2️⃣ Route Configuration Example**

Keep all validation and auth configurations in a separate file:

```typescript
// src/config/routes/userRoutesConfig.ts
import { z } from 'zod';
import type { AuthConfig, ValidationSchema } from 'express-pack';
import UserHelper from '../../helper/user.helper';

interface RouteConfig {
  validation?: ValidationSchema;
  auth?: AuthConfig;
}

interface UserRoutesConfig {
  login: RouteConfig;
  register: RouteConfig;
  profile: RouteConfig;
  delete: RouteConfig;
}

export const userRoutesConfig: UserRoutesConfig = {
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
      secret: process.env.JWT_SECRET!,
      headerKey: 'authorization',
      usingBearer: true,
      callback: UserHelper.getUser,
    },
  },
  delete: {
    auth: {
      secret: process.env.JWT_SECRET!,
      headerKey: 'authorization',
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

```typescript
import { RequestValidator, z } from 'express-pack';

RequestValidator.validateRequest({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  params: z.object({
    user_id: z.string().uuid(),
  }),
  query: z.object({
    force: z.boolean().optional(),
  }),
});
```

**Behavior:**

- `req.data` contains parsed and validated data
- Returns `400` if validation fails
- Returns `500` for unexpected errors

---

### **4️⃣ Async Route Handling**

Wrap your async controllers with `AsyncRouteWrapper` to automatically forward errors to Express error handlers:

```typescript
import { AsyncRouteWrapper } from 'express-pack';
import type { Request, Response } from 'express';
import UserHelper from '../helper/user.helper';

AsyncRouteWrapper.asyncHandler(async (req: Request, res: Response) => {
  const user = await UserHelper.getUser(req);
  res.json({ data: user });
});
```

---

### **5️⃣ JWT Authentication**

Authenticate routes easily using `AuthMiddleware.authenticateUser`:

```typescript
import { AuthMiddleware } from 'express-pack';
import type { AuthConfig } from 'express-pack';
import UserHelper from '../helper/user.helper';

const authConfig: AuthConfig = {
  secret: process.env.JWT_SECRET!,
  headerKey: 'authorization',
  usingBearer: true,
  callback: UserHelper.getUser, // returns user object -> attached to req.user
};

AuthMiddleware.authenticateUser(authConfig);
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

```typescript
import { ModelBuilder, z, type ModelBuildConfig, type SchemaDefinition } from 'express-pack';
import type { Schema } from 'mongoose';

// 🔹 Define schema fields with TypeScript interface
interface UserSchemaFields {
  org_id: string;
  name: string;
  email: string;
  password?: string;
  userRole: 'user' | 'seller' | 'admin';
  token?: string;
  lastLogin?: Date;
  currentOrder: number;
  returnedCount: number;
  shopName?: string;
  shopMobileNumber?: string;
  shopAddress?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

// 🔹 Define schema definition
const userSchema: SchemaDefinition = {
  org_id: { type: String, required: true }, // Tenant ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userRole: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
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
  name: 'user',
  schemaDefinition: userSchema,
  schemaOptions: {},

  plugins: {
    // 🏷 Multi-tenancy
    multiTenancy: { field: 'org_id' },

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
    slugGenerator: { slugField: 'slug', sourceField: 'name', unique: true },

    // 📊 Index manager
    indexManager: {
      indexes: [
        {
          field: 'name',
          type: 1,
          name: 'idx_name_asc',
          options: { unique: false },
        },
      ],
    },

    // 🔁 Retry handler
    retryHandler: { retries: 5, delay: 1500 },

    // 🔒 Field encryption
    fieldEncryption: { fields: ['password'] },

    // ✅ Unique constraint
    uniqueConstraint: {
      fields: ['email'],
      messages: { email: 'Email already exists' },
    },

    // 🧪 Schema validation
    schemaValidation: {
      validate: {
        email: z.string().email({ message: 'Invalid email format' }),
        age: z.number().min(0, { message: 'Age must be non-negative' }),
      },
    },
  },
});

export default User;
```

---

## **2️⃣ Model Usage Examples**

### **⚡ Create / Save**

```typescript
import type { Document } from 'mongoose';

interface UserDocument extends Document, UserSchemaFields {
  saveWithRetry(): Promise<this>;
}

const newUser = new User({
  org_id: 'tenant_123', // required tenant ID
  name: 'Alice',
  email: 'alice@example.com',
  password: '12345',
}) as UserDocument;

// 🔁 Save with retry
await newUser.saveWithRetry();
```

---

### **⚡ Find One**

```typescript
// Multi-tenancy applied automatically
const user = await User.findOne({
  org_id: 'tenant_123',
  email: 'alice@example.com',
});

// Skip tenant filter if needed
const userWithoutTenant = await User.findOne(
  { email: 'alice@example.com' },
  null,
  { skipTenantCheck: true }
);
```

---

### **⚡ Find / Paginate**

```typescript
import type { PaginateOptions, PaginateResult } from 'express-pack';

// Paginate users for a tenant
const paginatedUsers: PaginateResult = await User.paginate({
  page: 1,
  limit: 10,
  filter: { org_id: 'tenant_123', userRole: 'user' }, // tenant + filter
  sort: { name: 1 },
});

// Skip tenant check (use carefully)
const allUsers: PaginateResult = await User.paginate({
  page: 1,
  limit: 10,
  filter: { userRole: 'user' },
  skipTenantCheck: true,
});
```

---

### **⚡ Update**

```typescript
// Update a user (multi-tenancy applied automatically)
await User.update(
  { org_id: 'tenant_123', _id: user._id },
  { userRole: 'seller' }
);

// Skip tenant check
await User.update(
  { _id: user._id },
  { userRole: 'admin' },
  { skipTenantCheck: true }
);
```

---

### **⚡ Soft Delete / Restore**

```typescript
// Soft delete a document
await user.softDelete();

// Restore a soft-deleted document
await user.restore();
```

---

### **⚡ Slug / Versioning / Encryption**

```typescript
// Slug generated automatically from name
console.log(user.slug);

// Version increments automatically
user.name = 'Alice Updated';
await user.saveWithRetry();
console.log(user.__v); // version number

// Encrypted fields automatically decrypted on find
console.log(user.password); // decrypted password
```

---

### **⚡ Unique Constraint / Validation**

```typescript
try {
  const invalidUser = new User({
    email: 'invalidemail',
    org_id: 'tenant_123',
    name: 'Bob',
  });
  await invalidUser.saveWithRetry();
} catch (err) {
  console.error((err as Error).message); // Validation error or unique constraint
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

```typescript
import User from '../../../../schema/user/user.schema';
import Wishlist from '../../../../schema/wishlist/wishlist.schema';
import { ResponseUtil } from 'express-pack';
import type { Request, Response } from 'express';

// Example: Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).setOptions({
      skipTenantCheck: true,
    });

    if (!user) {
      return ResponseUtil.send(req, res, 'DATA_NOT_FOUND');
    }

    // Example: password validation & JWT generation skipped

    ResponseUtil.send(req, res, 'SUCCESS', {
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    ResponseUtil.send(req, res, 'INTERNAL_SERVER_ERROR');
  }
};

// Example: Register Controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseUtil.send(req, res, 'USER_ALREADY_EXIST');
    }

    const newUser = new User({ name, email });
    await newUser.saveWithRetry();

    await Wishlist.create({ name: 'General', userId: newUser._id });

    ResponseUtil.send(req, res, 'REGISTER_SUCCESS');
  } catch (error) {
    ResponseUtil.send(req, res, 'INTERNAL_SERVER_ERROR');
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

```typescript
import { EncryptionUtil } from 'express-pack';

// Hash a password
const hashedPassword: string = await EncryptionUtil.hash({
  password: 'mySecurePassword123!',
  saltRounds: 12, // optional, default 10
});

// Compare password with hash
const isValid: boolean = await EncryptionUtil.compare({
  password: 'mySecurePassword123!',
  hashed: hashedPassword,
});

// Encrypt a text
const encryptedText: string = EncryptionUtil.encrypt({
  text: 'Hello World!',
  key: process.env.ENCRYPTION_KEY, // optional, default 32-byte env key
});

// Decrypt a text
const decryptedText: string = EncryptionUtil.decrypt({
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

```typescript
import { JWTUtil } from 'express-pack';

// Generate access and refresh tokens
const { accessToken, refreshToken } = await JWTUtil.generateTokens({
  tokenPayload: {
    payload: { userId: '123', role: 'admin' },
    JWT_SECRET: process.env.JWT_SECRET!,
    expiresIn: '1h', // optional, default "25m"
  },
  refreshTokenPayload: {
    expiresIn: '7d',
    REFRESH_SECRET: process.env.REFRESH_SECRET!,
  }, // optional
  generateRefreshToken: true,
});

// Verify access token
const decodedPayload = await JWTUtil.verify({
  token: accessToken,
  JWT_SECRET: process.env.JWT_SECRET!,
});

// Decode token without verification
const tokenInfo = JWTUtil.decode({ token: accessToken });

// Verify refresh token
const refreshPayload = await JWTUtil.verifyRefreshToken({
  token: refreshToken,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
});

// Refresh access token using a refresh token
const newTokens = await JWTUtil.refreshAccessToken({
  token: refreshToken,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
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

```typescript
import { LodashHelper } from 'express-pack';

// Get value safely from object
const user = { name: { first: 'John', last: 'Doe' } };
const firstName: string = LodashHelper.get(user, 'name.first'); // "John"
const middleName: string = LodashHelper.get(user, 'name.middle', 'N/A'); // "N/A"

// Set value in object
LodashHelper.set(user, 'name.middle', 'Michael');

// Merge multiple objects
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = LodashHelper.merge(obj1, obj2); // { a:1, b:3, c:4 }

// Deep clone an object
const clonedUser = LodashHelper.cloneDeep(user);

// Check if object or array is empty
const isEmpty: boolean = LodashHelper.isEmpty({}); // true

// Pick and omit object keys
const picked = LodashHelper.pick(user, ['name.first']); // { name: { first: "John" } }
const omitted = LodashHelper.omit(user, ['name.last']); // { name: { first: "John" } }

// Unique array by key
const users = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 1, name: 'A' },
];
const uniqueUsers = LodashHelper.uniqBy(users, 'id');

// Debounce function
const log = () => console.log('Called');
const debouncedLog = LodashHelper.debounce(log, 500);

// Get value or default
const age: number = LodashHelper.getOrDefault(user, 'profile.age', 18);

// Check if multiple nested keys exist
const hasKeys: boolean = LodashHelper.hasNestedKeys(user, ['name.first', 'name.last']); // true

// Deep clone and set a value
const updatedDeep = LodashHelper.deepCloneAndSet(
  user,
  'name.middle',
  'Michael'
);

// Compact object (remove null, undefined, or empty strings)
const compacted = LodashHelper.compactObject({ a: 1, b: null, c: '' }); // { a: 1 }
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

```typescript
import { DateUtilBusiness } from 'express-pack';

const date = new Date('2025-10-25');

// Check if a date is a business day
const isBusiness: boolean = DateUtilBusiness.isBusinessDay(date);

// Get the next business day
const nextBusiness: Date = DateUtilBusiness.nextBusinessDay(date);

// Add N business days
const newDate: Date = DateUtilBusiness.addBusinessDays(date, 5);

// Check for holidays
const holidays: Date[] = [new Date('2025-10-31')];
const isHoliday: boolean = DateUtilBusiness.isHoliday(date, holidays);

// Get Nth weekday of a month (e.g., 2nd Tuesday of October 2025)
const secondTuesday: Date = DateUtilBusiness.getNthWeekdayInMonth(2, 2, 9, 2025); // month is 0-based
```

---

### 4.2 Comparison Utilities (`DateUtilCompare`)

Utilities for **comparing dates at different granularities**.

#### **Usage**

```typescript
import { DateUtilCompare } from 'express-pack';

const date1 = new Date('2025-10-25T10:00:00');
const date2 = new Date('2025-10-25T15:00:00');

// Compare dates
const before: boolean = DateUtilCompare.isBefore(date1, date2, 'hour');
const after: boolean = DateUtilCompare.isAfter(date2, date1, 'day');
const same: boolean = DateUtilCompare.isSame(date1, date2, 'day');

// Compare numerically
const cmp: number = DateUtilCompare.compare(date1, date2);

// Check if date is between two others
const between: boolean = DateUtilCompare.isBetween(date1, date2, new Date('2025-10-26'));
```

---

### 4.3 Date Creation Utilities (`DateUtilCreate`)

Create dates from **strings, ISO, Unix timestamps, parts, or timezone-aware inputs**.

#### **Usage**

```typescript
import { DateUtilCreate } from 'express-pack';

// Create from formatted string
const dt1: Date = DateUtilCreate.create({
  value: '25-10-2025',
  format: 'dd-MM-yyyy',
});

// Current timestamp in timezone
const now: Date = DateUtilCreate.now('Asia/Kolkata');

// From Unix timestamp
const fromUnix: Date = DateUtilCreate.fromUnix(1740000000);

// From ISO string
const fromISO: Date = DateUtilCreate.fromISOString('2025-10-25T10:00:00Z');

// From parts
const fromParts: Date = DateUtilCreate.fromParts({
  year: 2025,
  month: 10,
  day: 25,
  hour: 10,
  minute: 30,
  timezone: 'UTC',
});
```

---

### 4.4 Duration Utilities (`DateUtilDuration`)

Calculate **differences, durations, weekdays, and relative times**.

#### **Usage**

```typescript
import { DateUtilDuration } from 'express-pack';

const start = new Date('2025-10-25T10:00:00');
const end = new Date('2025-10-27T15:30:00');

// Difference in days or hours
const diffDays: number = DateUtilDuration.diff(start, end, 'days');
const diffHoursFloat: number = DateUtilDuration.diff(start, end, 'hours', true);

// Breakdown duration into days, hours, minutes, seconds
const breakdown = DateUtilDuration.duration(start, end);

// Relative time from now
const fromNowStr: string = DateUtilDuration.fromNow(start);

// Count weekdays between two dates
const weekdays: number = DateUtilDuration.countWeekdays(start, end);
```

---

### 4.5 Edge Case Utilities (`DateUtilEdgeCase`)

Handle **invalid dates, fallback, ambiguous DST, min/max dates**.

#### **Usage**

```typescript
import { DateUtilEdgeCase } from 'express-pack';

const invalidDate = new Date('invalid');

// Fallback for invalid date
const safeDate: Date = DateUtilEdgeCase.handleInvalidFallback(
  invalidDate,
  new Date()
);

// Normalize any input to Date
const normalized: Date = DateUtilEdgeCase.normalizeDateInput('2025-10-25');

// Maximum and minimum dates
const maxDate: Date = DateUtilEdgeCase.getMaxDate(new Date(), new Date('2025-12-31'));
const minDate: Date = DateUtilEdgeCase.getMinDate(new Date(), new Date('2025-01-01'));

// Check ambiguous DST
const isDSTAmbiguous: boolean = DateUtilEdgeCase.isAmbiguousDST(new Date());
```

---

### 4.6 Formatting Utilities (`DateUtilFormat`)

Format and convert dates to **ISO, Unix, JSON, locale strings, and offsets**.

#### **Usage**

```typescript
import { DateUtilFormat } from 'express-pack';

const date = new Date('2025-10-25T10:00:00');

// Custom format
const formatted: string = DateUtilFormat.formatDate(date, 'dd/MM/yyyy HH:mm');

// ISO string
const iso: string = DateUtilFormat.toISOString(date);

// Unix timestamp
const unix: number = DateUtilFormat.toUnix(date);

// JSON string
const jsonStr: string = DateUtilFormat.toJSON(date);

// Locale string
const localeStr: string = DateUtilFormat.toLocaleString(date, 'en-GB');

// Timezone offset
const offset: number = DateUtilFormat.getOffset(date);
```

---

### 4.7 Manipulation Utilities (`DateUtilManipulate`)

Add, subtract, set, or clone dates; get **start or end of units**.

#### **Usage**

```typescript
import { DateUtilManipulate } from 'express-pack';

const date = new Date('2025-10-25T10:00:00');

// Add/subtract time units
const nextWeek: Date = DateUtilManipulate.add(date, 1, 'weeks');
const prevMonth: Date = DateUtilManipulate.subtract(date, 1, 'months');

// Set specific parts
const setYearDate: Date = DateUtilManipulate.set(date, 'year', 2030);

// Start/end of units
const startOfMonth: Date = DateUtilManipulate.startOf(date, 'month');
const endOfYear: Date = DateUtilManipulate.endOf(date, 'year');

// Clone date
const clone: Date = DateUtilManipulate.clone(date);
```

---

### 4.8 Range Utilities (`DateUtilsRange`)

Work with **date ranges**, chunk ranges, intersect or merge.

#### **Usage**

```typescript
import { DateUtilsRange } from 'express-pack';

const start = new Date('2025-10-01');
const end = new Date('2025-10-31');

// Get all dates in range
const range: Date[] = DateUtilsRange.getDateRange(start, end);

// Chunk by unit
const weeks = DateUtilsRange.chunkBy(range, 'week');

// Check intersection of ranges
const intersect = DateUtilsRange.intersectRanges(
  [start, end],
  [new Date('2025-10-15'), new Date('2025-11-01')]
);

// Merge multiple ranges
const merged = DateUtilsRange.mergeRanges([
  [start, new Date('2025-10-10')],
  [new Date('2025-10-05'), end],
]);
```

---

### 4.9 Timezone Utilities (`DateUtilTimezone`)

Convert dates to **different timezones, get offsets, and localized strings**.

#### **Usage**

```typescript
import { DateUtilTimezone } from 'express-pack';

const date = new Date();

// Convert to timezone
const indiaTime: Date = DateUtilTimezone.convertToTZ(date, 'Asia/Kolkata');

// Current timezone
const tz: string = DateUtilTimezone.getTimezone();

// Format with locale
const localeDate: string = DateUtilTimezone.withLocale(date, 'fr-FR');

// Timezone abbreviation
const tzAbbr: string = DateUtilTimezone.getTimezoneAbbr(date);

// Offset in minutes
const offsetMinutes: number = DateUtilTimezone.getTimezoneOffsetMinutes(date);
```

---

### 4.10 Validation Utilities (`DateUtilValidate`)

Validate **dates, leap years, DST, weekends, same-day checks**.

#### **Usage**

```typescript
import { DateUtilValidate } from 'express-pack';

// Validate date
const valid: boolean = DateUtilValidate.isValid('2025-10-25');

// Parse date from formats
const parsed: Date | null = DateUtilValidate.parseDate('25-10-2025', ['dd-MM-yyyy']);

// Leap year check
const leap: boolean = DateUtilValidate.isLeapYear(2024);

// DST and weekend check
const dst: boolean = DateUtilValidate.isDST(new Date());
const weekend: boolean = DateUtilValidate.isWeekend(new Date());

// Same day comparison
const sameDay: boolean = DateUtilValidate.isSameDay(
  new Date('2025-10-25'),
  new Date('2025-10-25')
);
```

---

✅ **Developer Notes:**

- Each `DateUtil*` class is **focused and type-safe**, designed for **real-world date handling**, including **business days, duration, ranges, formatting, manipulation, timezones, and validations**.
- Timezone handling relies on `date-fns-tz` for **accurate conversions**.
- Edge cases like **invalid dates, ambiguous DST, and leap years** are supported out-of-the-box.

---

---

## ⚡ Performance Optimization

Optimize your **express-pack** application for production workloads with these proven strategies.

### **1. Database Optimization**

#### **Connection Pooling**

Configure Mongoose connection pooling for better performance:

```typescript
import { Mongoose } from 'express-pack';

await Mongoose.init({
  uri: process.env.DB_URL!,
  options: {
    maxPoolSize: 10,        // Maximum number of connections
    minPoolSize: 5,          // Minimum number of connections
    socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    heartbeatFrequencyMS: 10000,    // Heartbeat every 10 seconds
  },
});
```

#### **Indexing Strategies**

Use the `indexManager` plugin for optimal query performance:

```typescript
const User = ModelBuilder.build({
  name: 'user',
  schemaDefinition: userSchema,
  plugins: {
    indexManager: {
      indexes: [
        // Single field index
        { field: 'email', type: 1, name: 'idx_email', options: { unique: true } },
        
        // Compound index for multi-field queries
        { field: 'org_id,createdAt', type: '1,-1', name: 'idx_org_created' },
        
        // Text index for search
        { field: 'name,description', type: 'text', name: 'idx_search' },
      ],
    },
  },
});
```

#### **Pagination Best Practices**

Always use pagination for list endpoints:

```typescript
import type { PaginateOptions, PaginateResult } from 'express-pack';

const options: PaginateOptions = {
  page: 1,
  limit: 20,  // Keep limits reasonable (10-50)
  filter: { org_id: tenantId, isActive: true },
  sort: { createdAt: -1 },
  select: 'name email createdAt', // Only select needed fields
};

const result: PaginateResult = await User.paginate(options);
```

### **2. Caching Strategies**

#### **Redis Caching Patterns**

Implement caching for frequently accessed data:

```typescript
import { RedisClientService } from 'express-pack';

// Cache-aside pattern
async function getUser(userId: string) {
  const cacheKey = `user:${userId}`;
  
  // Try cache first
  const cached = await RedisClientService.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - fetch from database
  const user = await User.findById(userId);
  
  // Store in cache with TTL
  await RedisClientService.set(
    cacheKey,
    JSON.stringify(user),
    { expire: 3600 } // 1 hour TTL
  );
  
  return user;
}
```

#### **Cache Invalidation**

Implement cache invalidation on updates:

```typescript
async function updateUser(userId: string, updates: Partial<UserSchemaFields>) {
  // Update database
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  
  // Invalidate cache
  await RedisClientService.del(`user:${userId}`);
  
  return user;
}
```

#### **TTL Recommendations**

- **Static data**: 24 hours (86400 seconds)
- **User profiles**: 1 hour (3600 seconds)
- **Session data**: 30 minutes (1800 seconds)
- **API responses**: 5 minutes (300 seconds)
- **Real-time data**: 30 seconds or no cache

### **3. Middleware Optimization**

#### **Middleware Ordering**

Order middleware for optimal performance:

```typescript
import { ExpressPack, ErrorHandler } from 'express-pack';
import express from 'express';

const app = express();

// 1. Security headers (fast)
// 2. CORS (fast)
// 3. Compression (before body parsing)
// 4. Body parsing
// 5. Logging
// 6. Rate limiting
// 7. Authentication (only on protected routes)
// 8. Routes
// 9. Error handlers

await ExpressPack.init({ app, config: appConfig });
```

#### **Conditional Middleware**

Apply middleware only where needed:

```typescript
import { AuthMiddleware } from 'express-pack';

// ❌ Bad - applies auth to all routes
app.use(AuthMiddleware.authenticateUser(authConfig));

// ✅ Good - applies auth only to protected routes
router.get('/public', publicHandler);
router.get(
  '/protected',
  AuthMiddleware.authenticateUser(authConfig),
  protectedHandler
);
```

### **4. Request/Response Optimization**

#### **Compression**

Enable compression for all responses:

```typescript
const config: MiddlewareConfig = {
  compression: {
    level: 6,           // Balance between speed and compression
    threshold: 1024,    // Only compress responses > 1KB
    filter: (req, res) => {
      // Don't compress if client doesn't support it
      if (req.headers['x-no-compression']) {
        return false;
      }
      return true;
    },
  },
};
```

#### **Payload Size Limits**

Set appropriate payload limits:

```typescript
const config: MiddlewareConfig = {
  bodyParser: {
    json: { limit: '10mb' },      // Adjust based on your needs
    urlencoded: { limit: '10mb', extended: true },
    raw: { limit: '10mb' },
  },
};
```

#### **Response Streaming**

Use streaming for large responses:

```typescript
import { AsyncRouteWrapper } from 'express-pack';
import type { Request, Response } from 'express';

const downloadFile = AsyncRouteWrapper.asyncHandler(
  async (req: Request, res: Response) => {
    const fileStream = getFileStream(req.params.fileId);
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
    
    fileStream.pipe(res);
  }
);
```

### **5. Monitoring & Profiling**

#### **Performance Metrics**

Track key performance indicators:

```typescript
import { Logger } from 'express-pack';

// Track response times
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info(`${req.method} ${req.path} - ${duration}ms`);
    
    // Alert on slow requests
    if (duration > 1000) {
      Logger.warn(`Slow request detected: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
});
```

#### **Memory Leak Detection**

Monitor memory usage:

```typescript
// Log memory usage periodically
setInterval(() => {
  const usage = process.memoryUsage();
  Logger.info('Memory usage:', {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
  });
}, 60000); // Every minute
```

#### **Database Query Profiling**

Enable Mongoose query logging in development:

```typescript
import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    Logger.debug(`Mongoose: ${collectionName}.${method}`, { query, doc });
  });
}
```

---

## ✅ Best Practices & Anti-Patterns

### **Configuration Management**

#### **✅ Do's**

```typescript
// Use environment variables for secrets
const config = {
  jwtSecret: process.env.JWT_SECRET!,
  dbUrl: process.env.DB_URL!,
};

// Centralize configuration
// config/index.ts
export const appConfig = {
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
};

// Validate configuration at startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// Use TypeScript for type-safe config
import type { MiddlewareConfig } from 'express-pack';
const config: MiddlewareConfig = { /* ... */ };
```

#### **❌ Don'ts**

```typescript
// ❌ Hardcoding secrets
const jwtSecret = 'my-secret-key-123';

// ❌ Different config formats across environments
const config = process.env.NODE_ENV === 'production' 
  ? require('./prod-config.json')
  : { /* inline config */ };

// ❌ Not validating configuration
const port = process.env.PORT; // Could be undefined
```

### **Error Handling**

#### **✅ Do's**

```typescript
// Use AsyncRouteWrapper for all async routes
import { AsyncRouteWrapper, ResponseUtil } from 'express-pack';

router.get('/users', AsyncRouteWrapper.asyncHandler(async (req, res) => {
  const users = await User.find();
  ResponseUtil.send(req, res, 'SUCCESS', users);
}));

// Implement global error handler
app.use(ErrorHandler.handleGlobalError);

// Log errors with context
Logger.error('Failed to fetch user', { userId, error: err.message });

// Return consistent error responses
ResponseUtil.send(req, res, 'INTERNAL_SERVER_ERROR');
```

#### **❌ Don'ts**

```typescript
// ❌ Swallowing errors silently
try {
  await someOperation();
} catch (err) {
  // Silent failure
}

// ❌ Exposing stack traces to clients
res.status(500).json({ error: err.stack });

// ❌ Not logging errors
catch (err) {
  res.status(500).json({ error: 'Something went wrong' });
}
```

### **Authentication & Authorization**

#### **✅ Do's**

```typescript
// Use JWT with short expiration
const { accessToken, refreshToken } = await JWTUtil.generateTokens({
  tokenPayload: {
    payload: { userId: user.id },
    JWT_SECRET: process.env.JWT_SECRET!,
    expiresIn: '15m', // Short-lived access token
  },
  refreshTokenPayload: {
    expiresIn: '7d', // Longer-lived refresh token
    REFRESH_SECRET: process.env.REFRESH_SECRET!,
  },
  generateRefreshToken: true,
});

// Validate tokens on every request
router.get('/protected', 
  AuthMiddleware.authenticateUser(authConfig),
  handler
);

// Use RBAC for authorization
import { authorizeRole } from 'express-pack';
router.delete('/users/:id',
  AuthMiddleware.authenticateUser(authConfig),
  authorizeRole(['admin']),
  deleteUser
);
```

#### **❌ Don'ts**

```typescript
// ❌ Storing passwords in plain text
const user = new User({ password: req.body.password });

// ❌ Using weak JWT secrets
const JWT_SECRET = '12345';

// ❌ Not expiring tokens
expiresIn: '999y'

// ❌ Not validating tokens
router.get('/protected', handler); // No auth check
```

### **Database Operations**

#### **✅ Do's**

```typescript
// Use connection pooling
await Mongoose.init({
  uri: process.env.DB_URL!,
  options: { maxPoolSize: 10, minPoolSize: 5 },
});

// Implement soft delete
plugins: { softDelete: true }

// Use transactions for multi-document operations
const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.create([newUser], { session });
  await Wallet.create([newWallet], { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}

// Index frequently queried fields
plugins: {
  indexManager: {
    indexes: [{ field: 'email', type: 1, options: { unique: true } }]
  }
}
```

#### **❌ Don'ts**

```typescript
// ❌ Not using connection pooling
// Default settings may not be optimal

// ❌ N+1 query problems
for (const user of users) {
  const orders = await Order.find({ userId: user.id }); // N queries
}
// ✅ Use populate or aggregation instead

// ❌ Not handling connection errors
Mongoose.init({ uri: dbUrl }); // No error handling
```

### **API Design**

#### **✅ Do's**

```typescript
// Use consistent response format
ResponseUtil.send(req, res, 'SUCCESS', data);

// Implement pagination
const result = await User.paginate({ page: 1, limit: 20 });

// Version your APIs
const routes: RouteGroup[] = [{
  prefix: '/api',
  version: '/v1',
  route: [{ path: '/users', route: userRouter }],
}];

// Use proper HTTP status codes
res.status(201).json({ message: 'Created' });
res.status(404).json({ message: 'Not found' });
```

#### **❌ Don'ts**

```typescript
// ❌ Inconsistent response formats
res.json({ data: users }); // One endpoint
res.json({ users }); // Another endpoint

// ❌ No pagination
const users = await User.find(); // Returns all users

// ❌ No API versioning
router.get('/users', handler); // Breaking changes affect all clients
```

---

## 🔧 Troubleshooting

### **Issue: "Express app not initialized" error**

**Symptoms:**
```
Error: Express app not initialized. Call init() first.
```

**Cause:** Calling `getApp()` or `getRouter()` before `init()`.

**Solution:**
```typescript
// ❌ Wrong order
const app = ExpressPack.getApp(); // Error!
await ExpressPack.init({ app, config });

// ✅ Correct order
const app = express();
await ExpressPack.init({ app, config });
const router = ExpressPack.getRouter(); // Now safe
```

**Prevention:** Always call `init()` before using any ExpressPack features.

---

### **Issue: Validation not working**

**Symptoms:** Request validation is not being applied; invalid data passes through.

**Cause:** Incorrect middleware order or missing validation schema.

**Solution:**
```typescript
// ✅ Correct - validation before handler
router.post(
  '/users',
  RequestValidator.validateRequest({ body: userSchema }),
  AsyncRouteWrapper.asyncHandler(createUser)
);

// ❌ Wrong - handler before validation
router.post(
  '/users',
  AsyncRouteWrapper.asyncHandler(createUser),
  RequestValidator.validateRequest({ body: userSchema }) // Never reached
);
```

**Prevention:** Always place validation middleware before route handlers.

---

### **Issue: Redis connection fails**

**Symptoms:**
```
Error: Redis connection failed: ECONNREFUSED 127.0.0.1:6379
```

**Cause:** Redis server not running or wrong configuration.

**Solution:**
```typescript
// Check Redis server is running
// Windows: redis-server.exe
// Linux/Mac: redis-server

// Verify configuration
const config: RedisConfig = {
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: 0,
};

RedisClientService.enableRedis(true, config);

// Add error handling
try {
  await RedisClientService.set('test', 'value');
} catch (err) {
  Logger.error('Redis error:', err);
}
```

**Prevention:** Always verify external services are running before starting your app.

---

### **Issue: RabbitMQ reconnection loop**

**Symptoms:** Application repeatedly tries to reconnect to RabbitMQ.

**Cause:** Invalid credentials or network issues.

**Solution:**
```typescript
// Verify connection string format
const config: RabbitMQConfig = {
  enabled: true,
  uri: 'amqp://username:password@localhost:5672',
  // Check username, password, host, and port are correct
};

// Add connection error handling
try {
  await RabbitMQService.init(config);
} catch (err) {
  Logger.error('RabbitMQ connection failed:', err);
  // Implement exponential backoff for retries
}
```

**Prevention:** Validate connection strings and credentials in configuration.

---

### **Issue: JWT token expired**

**Symptoms:**
```
Error: jwt expired
```

**Cause:** Token TTL too short or system clock skew.

**Solution:**
```typescript
// Adjust token expiration
const { accessToken } = await JWTUtil.generateTokens({
  tokenPayload: {
    payload: { userId: user.id },
    JWT_SECRET: process.env.JWT_SECRET!,
    expiresIn: '1h', // Increase from default 15m
  },
});

// Implement refresh token flow
const newTokens = await JWTUtil.refreshAccessToken({
  token: refreshToken,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
});
```

**Prevention:** Implement refresh token rotation for long-lived sessions.

---

### **Issue: CORS errors in browser**

**Symptoms:**
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Cause:** Incorrect CORS configuration.

**Solution:**
```typescript
const config: MiddlewareConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*', // Specify allowed origins
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};
```

**Prevention:** Configure CORS properly for your frontend domain.

---

### **Issue: Request body undefined**

**Symptoms:** `req.body` is `undefined` in route handlers.

**Cause:** Body parser not configured or wrong content-type.

**Solution:**
```typescript
// Enable body parser
const config: MiddlewareConfig = {
  bodyParser: {
    json: { limit: '10mb' },
    urlencoded: { extended: true, limit: '10mb' },
  },
};

// Ensure client sends correct Content-Type header
// Content-Type: application/json
```

**Prevention:** Always configure body parser in middleware config.

---

### **Issue: Mongoose connection timeout**

**Symptoms:**
```
MongooseServerSelectionError: connect ETIMEDOUT
```

**Cause:** Wrong connection string or network issues.

**Solution:**
```typescript
// Verify connection string
const dbUrl = process.env.DB_URL; // mongodb://localhost:27017/mydb

// Add connection options
await Mongoose.init({
  uri: dbUrl!,
  options: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
});

// Add error handling
mongoose.connection.on('error', (err) => {
  Logger.error('MongoDB connection error:', err);
});
```

**Prevention:** Test database connectivity before deploying.

---

## 📚 Examples

### **Complete REST API Example**

A full example project demonstrating express-pack features is available in the examples directory:

```
examples/
└── rest-api/
    ├── src/
    │   ├── config/
    │   │   ├── appConfig.ts
    │   │   ├── routeConfig.ts
    │   │   └── messageConfig.ts
    │   ├── modules/
    │   │   └── user/
    │   │       ├── controller/
    │   │       ├── router/
    │   │       └── schema/
    │   ├── loaders/
    │   │   └── index.ts
    │   └── app.ts
    └── package.json
```

**Features demonstrated:**
- TypeScript configuration
- Multi-tenant setup
- JWT authentication
- Request validation with Zod
- Mongoose models with plugins
- Redis caching
- RabbitMQ messaging
- Cron jobs
- Error handling
- API documentation

### **Future Examples**

Additional examples are planned for future releases:

- **GraphQL API**: GraphQL server with express-pack
- **Microservices**: Multi-service architecture with message queues
- **Real-time Chat**: WebSocket integration with express-pack
- **File Upload**: S3 integration for file uploads

**Note:** Example projects will be added in Task 6 of Phase 1.

---

## 🤝 Acknowledgments

I would like to express my sincere gratitude to everyone who inspired and contributed to the creation of **express-pack**.

- **Open Source Libraries & Tools**: This project leverages and is inspired by numerous open-source libraries such as **Express.js**, **MongoDB**, **Redis**, and **RabbitMQ**. Without the hard work and dedication of these communities, this library wouldn’t have been possible.
- **Mentors & Collaborators**: Special thanks to my mentors, colleagues, and fellow developers who provided guidance, feedback, and encouragement throughout the development of this project.
- **Community Inspiration**: The Node.js and backend development communities have been a constant source of learning, motivation, and innovation. Your contributions helped shape the ideas behind this library.
- **Family & Friends**: Thank you for your patience, support, and understanding during the development process.

This project is built on the shoulders of giants, and I hope **express-pack** will, in turn, help developers build scalable and maintainable backend applications with ease.
