# Task 2: Package Splitting Strategy

## Context

The current express-pack is a monolithic package (~40+ dependencies, large bundle size). Users who only need authentication still download caching, queuing, email, and storage code.

## Objective

Split express-pack into focused, scoped packages that can be installed independently, reducing bundle sizes and improving tree-shaking.

---

## Package Architecture

### Core Packages

**1. @express-pack/core**
- ExpressPack class
- Common middleware (body-parser, CORS, compression, security)
- Error handling
- Async route wrapper
- Request tracer
- **Dependencies:** express, helmet, cors, compression, body-parser
- **Size Target:** < 50KB

**2. @express-pack/auth**
- JWT utilities
- Passport integration (Google, Facebook, GitHub)
- Auth middleware
- RBAC and scope authorization
- **Dependencies:** @express-pack/core, jsonwebtoken, passport, bcrypt
- **Size Target:** < 30KB

**3. @express-pack/validation**
- Request validator
- Zod integration
- Custom validation rules
- **Dependencies:** @express-pack/core, zod
- **Size Target:** < 20KB

### Service Packages

**4. @express-pack/cache**
- Redis client service
- Cache utilities
- TTL management
- **Dependencies:** ioredis, redlock
- **Size Target:** < 25KB

**5. @express-pack/queue**
- RabbitMQ service
- Message publishing/consuming
- Retry logic
- **Dependencies:** amqplib
- **Size Target:** < 30KB

**6. @express-pack/scheduler**
- Cron manager
- Job scheduling
- Distributed locks
- **Dependencies:** @express-pack/cache, node-cron
- **Size Target:** < 25KB

**7. @express-pack/email**
- Email service abstraction
- SendGrid, SES, Nodemailer, Mailgun adapters
- Template support
- **Dependencies:** @sendgrid/mail, @aws-sdk/client-ses, nodemailer, mailgun.js
- **Size Target:** < 40KB

**8. @express-pack/storage**
- S3 storage service
- File upload utilities
- Presigned URLs
- **Dependencies:** @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- **Size Target:** < 30KB

**9. @express-pack/payment**
- Stripe integration
- Payment utilities
- **Dependencies:** stripe
- **Size Target:** < 20KB

**10. @express-pack/db**
- Mongoose connection
- Mongoose plugins (multi-tenant, soft-delete, timestamps, audit)
- **Dependencies:** mongoose
- **Size Target:** < 35KB

### Utility Packages

**11. @express-pack/utils**
- Date utilities (date-fns)
- String utilities (slugify, lodash)
- Encryption (bcrypt, crypto)
- Validation helpers
- Response utilities
- i18n utilities
- **Dependencies:** date-fns, lodash-es, bcrypt, slugify, i18next
- **Size Target:** < 40KB

**12. @express-pack/testing**
- Testing utilities
- Mocks (Redis, MongoDB, RabbitMQ)
- Test helpers
- **Dependencies:** @express-pack/core, vitest, supertest, mongodb-memory-server
- **Size Target:** < 30KB

**13. @express-pack/cli**
- CLI tool
- Scaffolding
- Code generation
- **Dependencies:** commander, inquirer, plop
- **Size Target:** < 50KB

### Facade Package

**14. express-pack** (main package)
- Re-exports all packages for backward compatibility
- Convenience package for full installation
- **Dependencies:** All @express-pack/* packages
- **Size:** Sum of all packages (but users can install selectively)

---

## Migration Strategy

### Step 1: Create Package Structure

For each package:

```bash
mkdir -p packages/<package-name>/src
cd packages/<package-name>

# Create package.json
cat > package.json << EOF
{
  "name": "@express-pack/<package-name>",
  "version": "2.0.0",
  "description": "...",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    "require": "./dist/index.cjs",
    "import": "./dist/index.mjs",
    "types": "./dist/index.d.ts"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run"
  },
  "peerDependencies": {
    "express": "^4.0.0"
  }
}
EOF
```

### Step 2: Move Code

**Example: Moving auth code to @express-pack/auth**

```bash
# From monolithic structure
src/auth/
├── middleware/
├── util/
│   ├── jwt/
│   └── passport/
└── types/

# To package structure
packages/auth/src/
├── middleware/
│   └── index.ts
├── util/
│   ├── jwt.ts
│   └── passport.ts
├── types.ts
└── index.ts
```

**packages/auth/src/index.ts:**
```typescript
export * from './middleware/index.js';
export * from './util/jwt.js';
export * from './util/passport.js';
export * from './types.js';
```

### Step 3: Update Imports

**Before (monolithic):**
```typescript
import { JWTUtil, AuthMiddleware } from 'express-pack';
```

**After (scoped):**
```typescript
import { JWTUtil, AuthMiddleware } from '@express-pack/auth';
```

### Step 4: Handle Cross-Package Dependencies

**Example: @express-pack/scheduler depends on @express-pack/cache**

**packages/scheduler/package.json:**
```json
{
  "dependencies": {
    "@express-pack/cache": "workspace:*",
    "node-cron": "^4.0.5"
  }
}
```

**packages/scheduler/src/index.ts:**
```typescript
import { RedisClientService } from '@express-pack/cache';
import cron from 'node-cron';

export class CronManager {
  constructor(private redis: typeof RedisClientService) {
    // ...
  }
}
```

### Step 5: Create Facade Package

**packages/express-pack/package.json:**
```json
{
  "name": "express-pack",
  "version": "2.0.0",
  "description": "Complete express-pack bundle (all packages)",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@express-pack/core": "workspace:*",
    "@express-pack/auth": "workspace:*",
    "@express-pack/validation": "workspace:*",
    "@express-pack/cache": "workspace:*",
    "@express-pack/queue": "workspace:*",
    "@express-pack/scheduler": "workspace:*",
    "@express-pack/email": "workspace:*",
    "@express-pack/storage": "workspace:*",
    "@express-pack/payment": "workspace:*",
    "@express-pack/db": "workspace:*",
    "@express-pack/utils": "workspace:*"
  }
}
```

**packages/express-pack/src/index.ts:**
```typescript
// Re-export everything for backward compatibility
export * from '@express-pack/core';
export * from '@express-pack/auth';
export * from '@express-pack/validation';
export * from '@express-pack/cache';
export * from '@express-pack/queue';
export * from '@express-pack/scheduler';
export * from '@express-pack/email';
export * from '@express-pack/storage';
export * from '@express-pack/payment';
export * from '@express-pack/db';
export * from '@express-pack/utils';
```

---

## Implementation Steps

1. **Create Package Directories**
   ```bash
   for pkg in core auth validation cache queue scheduler email storage payment db utils testing cli express-pack; do
     mkdir -p packages/$pkg/src
   done
   ```

2. **Setup Package Configurations**
   - Create package.json for each
   - Create tsconfig.json for each
   - Create tsup.config.ts for each

3. **Move Code Systematically**
   - Start with core (no dependencies)
   - Then auth, validation (depend on core)
   - Then services (may depend on core, cache)
   - Then utils
   - Finally facade package

4. **Update Imports**
   - Use find/replace for import statements
   - Update path aliases

5. **Test Each Package**
   ```bash
   cd packages/core && npm run build && npm test
   cd packages/auth && npm run build && npm test
   # ... for each package
   ```

6. **Build All Packages**
   ```bash
   lerna run build
   ```

7. **Test Integration**
   - Test facade package
   - Test example projects with new packages

---

## Verification

### Automated Tests

```bash
# Build all packages
lerna run build

# Test all packages
lerna run test

# Check bundle sizes
lerna exec -- du -sh dist

# Verify exports
node -e "console.log(require('@express-pack/core'))"
```

### Manual Verification

- [ ] All packages build successfully
- [ ] All tests pass
- [ ] Bundle sizes meet targets
- [ ] Imports work correctly
- [ ] Facade package re-exports everything
- [ ] Example projects work with new structure

---

## Success Metrics

- 14 packages created
- All packages < target size
- Total bundle size reduced by 40%+
- All tests passing
- Backward compatibility maintained
- Tree-shaking working

---

## Estimated Effort

- **Time:** 3 days
- **Complexity:** High
- **Risk:** Medium

---

## Dependencies

- Task 1: Monorepo Setup (must be complete)

---

## Follow-up Tasks

- Update documentation
- Create migration guide
- Publish packages to npm
