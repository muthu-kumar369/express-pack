# Express Pack Examples

This directory contains example applications demonstrating various use cases of express-pack.

## Examples

### 1. REST API (`rest-api/`)
Complete REST API with authentication, user management, and database integration.

### 2. Microservice (`microservice/`)
Microservice architecture with queue, cron jobs, and email services.

### 3. Multi-tenant (`multitenant/`)
Multi-tenant application with tenant isolation and usage tracking.

---

## Package Imports

All examples currently use the **facade package** for convenience:

```typescript
import { ExpressPack, JWTUtil, RedisClientService } from 'express-pack';
```

### Alternative: Scoped Packages (Smaller Bundles)

You can also use scoped packages for smaller bundle sizes:

```typescript
// Instead of facade
import { ExpressPack, JWTUtil, RedisClientService } from 'express-pack';

// Use scoped packages
import { ExpressPack } from '@express-pack/core';
import { JWTUtil } from '@express-pack/auth';
import { RedisClientService } from '@express-pack/cache';
```

**Bundle Size Comparison:**
- **Facade (`express-pack`):** ~300KB (includes all packages)
- **Scoped packages:** 30-100KB (only what you need)

---

## Import Mapping Guide

| Facade Import | Scoped Package |
|---------------|----------------|
| `ExpressPack`, `AsyncRouteWrapper` | `@express-pack/core` |
| `JWTUtil`, `AuthMiddleware` | `@express-pack/auth` |
| `RequestValidator` | `@express-pack/validation` |
| `RedisClientService` | `@express-pack/cache` |
| `RabbitMQService` | `@express-pack/queue` |
| `CronManager` | `@express-pack/scheduler` |
| `EmailService` | `@express-pack/email` |
| `S3StorageService` | `@express-pack/storage` |
| `StripeService` | `@express-pack/payment` |
| `TimestampPlugin`, `SoftDeletePlugin` | `@express-pack/db` |
| `EncryptionUtil`, `ResponseUtil` | `@express-pack/utils` |

---

## Running Examples

### REST API
```bash
cd examples/rest-api
npm install
npm run dev
```

### Microservice
```bash
cd examples/microservice
npm install
npm run dev
```

### Multi-tenant
```bash
cd examples/multitenant
npm install
npm run dev
```

---

## Migration to Scoped Packages

To migrate an example to use scoped packages:

1. **Update package.json:**
```json
{
  "dependencies": {
    "@express-pack/core": "^2.0.0",
    "@express-pack/auth": "^2.0.0",
    "@express-pack/cache": "^2.0.0"
  }
}
```

2. **Update imports:**
```typescript
// Before
import { ExpressPack, JWTUtil } from 'express-pack';

// After
import { ExpressPack } from '@express-pack/core';
import { JWTUtil } from '@express-pack/auth';
```

3. **Install and test:**
```bash
npm install
npm run build
npm run dev
```

---

## Notes

- **Backward Compatibility:** All examples work with both facade and scoped packages
- **Recommended:** Use facade for quick prototyping, scoped packages for production
- **Tree-shaking:** Scoped packages enable better tree-shaking and smaller bundles

For more details, see [MIGRATION.md](../MIGRATION.md) in the root directory.
