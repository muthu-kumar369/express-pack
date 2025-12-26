# Migration Guide: express-pack v1 → v2

## Overview

Express-pack v2 introduces a **modular package architecture** that allows you to install only the packages you need, reducing bundle sizes and improving tree-shaking.

---

## Breaking Changes

### 1. Package Structure

**v1 (Monolithic):**
```bash
npm install express-pack
```

**v2 (Modular):**
```bash
# Install only what you need
npm install @express-pack/core @express-pack/auth

# OR install everything (backward compatible)
npm install express-pack
```

### 2. Import Paths

**v1:**
```typescript
import { ExpressPack, JWTUtil, RedisClientService } from 'express-pack';
```

**v2 (Scoped Packages):**
```typescript
import { ExpressPack } from '@express-pack/core';
import { JWTUtil } from '@express-pack/auth';
import { RedisClientService } from '@express-pack/cache';
```

**v2 (Facade - Backward Compatible):**
```typescript
// Still works! Imports from main package
import { ExpressPack, JWTUtil, RedisClientService } from 'express-pack';
```

---

## Package Mapping

| v1 Import | v2 Scoped Package |
|-----------|-------------------|
| `ExpressPack`, middleware, error handling | `@express-pack/core` |
| `JWTUtil`, `AuthMiddleware`, Passport | `@express-pack/auth` |
| Request validation, Zod | `@express-pack/validation` |
| `RedisClientService` | `@express-pack/cache` |
| `RabbitMQService` | `@express-pack/queue` |
| `CronManager` | `@express-pack/scheduler` |
| Email services (SendGrid, SES, etc.) | `@express-pack/email` |
| `S3StorageService` | `@express-pack/storage` |
| `StripeService` | `@express-pack/payment` |
| Mongoose connection, plugins | `@express-pack/db` |
| Date, string, crypto utilities | `@express-pack/utils` |
| Testing utilities, mocks | `@express-pack/testing` |
| CLI tools | `@express-pack/cli` |

---

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

Keep using the facade package while you migrate:

```typescript
// Step 1: Keep using facade
import { ExpressPack, JWTUtil } from 'express-pack';

// Step 2: Gradually switch to scoped packages
import { ExpressPack } from '@express-pack/core';
import { JWTUtil } from '@express-pack/auth';
// import { ... } from 'express-pack'; // Remove unused imports

// Step 3: Uninstall facade when done
// npm uninstall express-pack
// npm install @express-pack/core @express-pack/auth
```

### Strategy 2: Direct Migration

Switch to scoped packages immediately for smaller bundles:

```bash
# Remove old package
npm uninstall express-pack

# Install only what you need
npm install @express-pack/core @express-pack/auth @express-pack/cache
```

---

## Example Migrations

### Example 1: Basic Express App

**Before (v1):**
```typescript
import { ExpressPack } from 'express-pack';
import express from 'express';

const app = express();

ExpressPack.init({
  app,
  config: {
    cors: { origin: '*' },
    bodyParser: {},
  },
});
```

**After (v2):**
```typescript
import { ExpressPack } from '@express-pack/core';
import express from 'express';

const app = express();

ExpressPack.init({
  app,
  config: {
    cors: { origin: '*' },
    bodyParser: {},
  },
});
```

### Example 2: Auth + Cache

**Before (v1):**
```typescript
import { JWTUtil, RedisClientService } from 'express-pack';

const token = JWTUtil.sign({ userId: '123' }, 'secret');
await RedisClientService.set('key', 'value');
```

**After (v2):**
```typescript
import { JWTUtil } from '@express-pack/auth';
import { RedisClientService } from '@express-pack/cache';

const token = JWTUtil.sign({ userId: '123' }, 'secret');
await RedisClientService.set('key', 'value');
```

### Example 3: Full Stack App

**Before (v1):**
```typescript
import {
  ExpressPack,
  JWTUtil,
  RedisClientService,
  RabbitMQService,
  S3StorageService,
  StripeService,
} from 'express-pack';
```

**After (v2 - Scoped):**
```typescript
import { ExpressPack } from '@express-pack/core';
import { JWTUtil } from '@express-pack/auth';
import { RedisClientService } from '@express-pack/cache';
import { RabbitMQService } from '@express-pack/queue';
import { S3StorageService } from '@express-pack/storage';
import { StripeService } from '@express-pack/payment';
```

**After (v2 - Facade):**
```typescript
// No changes needed! Still works
import {
  ExpressPack,
  JWTUtil,
  RedisClientService,
  RabbitMQService,
  S3StorageService,
  StripeService,
} from 'express-pack';
```

---

## Bundle Size Comparison

### v1 (Monolithic)
- **Total:** ~500KB (includes everything)
- **Your app uses only auth?** Still downloads 500KB

### v2 (Modular)
- **Core only:** ~33KB
- **Core + Auth:** ~46KB
- **Core + Auth + Cache:** ~57KB
- **All packages (facade):** ~300KB (smaller than v1!)

**Savings:** Up to **90% smaller** bundles when using only what you need!

---

## New Features in v2

### 1. Validation Package
```typescript
import { validate, z } from '@express-pack/validation';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

app.post('/users', validate({ body: userSchema }), (req, res) => {
  // req.body is validated and typed!
});
```

### 2. Utils Package
```typescript
import { formatDate, createSlug, sendSuccess } from '@express-pack/utils';

const slug = createSlug('Hello World'); // 'hello-world'
const date = formatDate(new Date(), 'yyyy-MM-dd');
sendSuccess(res, { user }, 'User created');
```

---

## TypeScript Support

All packages include full TypeScript definitions:

```typescript
import type { ExpressPackConfig } from '@express-pack/core';
import type { JWTPayload } from '@express-pack/auth';
import type { RedisSetOptions } from '@express-pack/cache';
```

---

## Testing

### v1
```typescript
import { createTestApp } from 'express-pack/testing';
```

### v2
```typescript
import { createTestApp } from '@express-pack/testing';
```

---

## FAQ

### Q: Do I have to migrate immediately?
**A:** No! The facade package (`express-pack`) maintains backward compatibility. Migrate when ready.

### Q: Can I mix scoped packages and the facade?
**A:** Yes, but not recommended. Choose one approach for consistency.

### Q: Will v1 be supported?
**A:** v1 will receive critical bug fixes for 6 months. New features only in v2.

### Q: How do I know which packages I need?
**A:** Check your imports! Each import maps to a specific package (see table above).

### Q: What if I need everything?
**A:** Use `npm install express-pack` - it includes all packages.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/express-pack/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/express-pack/discussions)
- **Documentation:** [docs.express-pack.dev](https://docs.express-pack.dev)

---

## Summary

✅ **Backward compatible** - Facade package works like v1  
✅ **Smaller bundles** - Install only what you need  
✅ **Better tree-shaking** - Modular architecture  
✅ **TypeScript first** - Full type definitions  
✅ **Easy migration** - Gradual or direct migration paths  

**Recommended:** Start with the facade, migrate gradually to scoped packages for optimal bundle sizes.
