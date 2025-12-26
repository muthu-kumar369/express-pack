# @express-pack

![Express-Pack Logo](https://i.ibb.co/1t1zKdvf/express-pack-logo-1-1-2.png)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Monorepo](https://img.shields.io/badge/Monorepo-Lerna-cc00ff)
[![npm version](https://img.shields.io/npm/v/@express-pack/core.svg)](https://www.npmjs.com/package/@express-pack/core)

**express-pack** is a modular ecosystem for building scalable Express.js applications. Originally a monolithic utility, v2.0 transforms it into a collection of scoped packages that you can mix and match.

> **v2.0 Released!** Now with scoped packages, tree-shaking, and a powerful CLI.

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| **[`@express-pack/core`](./packages/core)** | Core utilities, error handling, and config wrappers. |
| **[`@express-pack/auth`](./packages/auth)** | JWT authentication and role-based authorization. |
| **[`@express-pack/validation`](./packages/validation)** | Zod-based request validation middleware. |
| **[`@express-pack/db`](./packages/db)** | Mongoose plugins (Multi-tenant, Soft Delete). |
| **[`@express-pack/cache`](./packages/cache)** | Redis client and caching utilities. |
| **[`@express-pack/queue`](./packages/queue)** | RabbitMQ integration. |
| **[`@express-pack/scheduler`](./packages/scheduler)** | Cron job management with distributed locking. |
| **[`@express-pack/cli`](./packages/cli)** | CLI tool for scaffolding and generation. |
| ...and more! | |

---

## 🚀 Quick Start

### Option 1: Using the CLI (Recommended)

```bash
# Initialize a new project
npx @express-pack/cli init my-app
cd my-app
npm run dev
```

### Option 2: Manual Installation (Modular)

Install only what you need:

```bash
npm install express @express-pack/core @express-pack/auth
```

```typescript
import { ExpressPack } from '@express-pack/core';
import { AuthMiddleware } from '@express-pack/auth';

// ... usage
```

### Option 3: Legacy/All-in-One (Facade)

For backward compatibility or quick prototyping:

```bash
npm install express-pack
```

```typescript
// Imports all packages under the hood
import { ExpressPack, AuthMiddleware } from 'express-pack';
```

---

## 📖 Documentation

- **[Migration Guide (v1 → v2)](./MIGRATION.md)**
- **[Examples](./examples/README.md)**
- [Full Documentation (Coming Soon)]

---

## 🛠 Features

- **Modular:** Install only what you use.
- **TypeScript:** Built with TS for first-class type support.
- **Tree-Shakable:** Optimized for small bundle sizes.
- **Standardized:** Consistent patterns for Auth, DB, Caching, etc.

(See [`v1 README`](./README.backup.md) for legacy documentation)
