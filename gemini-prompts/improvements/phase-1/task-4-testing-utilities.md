# Task 4: Testing Utilities and Infrastructure

## Context

express-pack currently has no testing utilities or test coverage. This makes it difficult to:
- Ensure code quality and correctness
- Refactor safely
- Prevent regressions
- Build confidence in the library

## Objective

Create a comprehensive testing infrastructure including:
1. Testing utilities for developers using express-pack
2. Internal test coverage for express-pack itself
3. Testing documentation and examples

---

## Requirements

### 1. Testing Framework Setup

**Install Dependencies:**
```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  @types/supertest \
  supertest \
  mongodb-memory-server \
  ioredis-mock
```

**Create Vitest Configuration:**

File: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. Create Testing Utilities Package

**File Structure:**
```
src/
└── testing/
    ├── index.ts                    # Main exports
    ├── app/
    │   ├── createTestApp.ts        # Create test Express app
    │   └── request.ts              # Supertest wrapper
    ├── mocks/
    │   ├── redis.mock.ts           # Mock Redis client
    │   ├── rabbitmq.mock.ts        # Mock RabbitMQ
    │   ├── mongoose.mock.ts        # Mock Mongoose
    │   ├── email.mock.ts           # Mock email services
    │   └── storage.mock.ts         # Mock S3 storage
    ├── fixtures/
    │   ├── users.ts                # Test user data
    │   └── config.ts               # Test configurations
    └── helpers/
        ├── auth.ts                 # Auth test helpers
        └── database.ts             # Database test helpers
```

**Implementation:**

**1. createTestApp.ts:**
```typescript
import express, { Application, Router } from 'express';
import { ExpressPack, MiddlewareConfig } from '../index';

export interface TestAppOptions {
  routes?: Router[];
  config?: MiddlewareConfig;
  mocks?: {
    redis?: boolean;
    rabbitmq?: boolean;
    mongoose?: boolean;
    email?: boolean;
  };
}

/**
 * Creates a test Express application with express-pack initialized
 * 
 * @example
 * ```typescript
 * import { createTestApp } from 'express-pack/testing';
 * 
 * const app = await createTestApp({
 *   routes: [userRouter],
 *   config: { cors: {}, bodyParser: {} },
 *   mocks: { redis: true, mongoose: true }
 * });
 * ```
 */
export async function createTestApp(
  options: TestAppOptions = {}
): Promise<Application> {
  const { routes = [], config = {}, mocks = {} } = options;

  const app = express();

  // Initialize with test config
  await ExpressPack.init({
    app,
    config: {
      bodyParser: {},
      cors: { origin: '*' },
      logger: { level: 'silent' }, // Silent in tests
      ...config,
    },
  });

  // Mount routes
  routes.forEach((router) => {
    app.use(router);
  });

  // Setup mocks if requested
  if (mocks.redis) {
    const { setupRedisMock } = await import('./mocks/redis.mock');
    setupRedisMock();
  }

  if (mocks.mongoose) {
    const { setupMongooseMock } = await import('./mocks/mongoose.mock');
    await setupMongooseMock();
  }

  return app;
}
```

**2. request.ts:**
```typescript
import supertest, { SuperTest, Test } from 'supertest';
import { Application } from 'express';

/**
 * Creates a supertest instance with common headers and utilities
 * 
 * @example
 * ```typescript
 * import { createTestRequest } from 'express-pack/testing';
 * 
 * const request = createTestRequest(app);
 * const res = await request.get('/users').expect(200);
 * ```
 */
export function createTestRequest(app: Application): SuperTest<Test> {
  return supertest(app);
}

/**
 * Creates an authenticated request with JWT token
 */
export function createAuthenticatedRequest(
  app: Application,
  token: string
): SuperTest<Test> {
  const request = supertest(app);
  
  // Add default auth header
  return {
    ...request,
    get: (url: string) => request.get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request.post(url).set('Authorization', `Bearer ${token}`),
    put: (url: string) => request.put(url).set('Authorization', `Bearer ${token}`),
    delete: (url: string) => request.delete(url).set('Authorization', `Bearer ${token}`),
  } as SuperTest<Test>;
}
```

**3. redis.mock.ts:**
```typescript
import RedisMock from 'ioredis-mock';
import { RedisClientService } from '../../service/cache/redis';

/**
 * Sets up Redis mock for testing
 */
export function setupRedisMock() {
  const redisMock = new RedisMock();
  
  // Replace real Redis client with mock
  jest.spyOn(RedisClientService, 'getClient').mockReturnValue(redisMock as any);
  
  return redisMock;
}

/**
 * Clears all Redis mock data
 */
export async function clearRedisMock() {
  const client = RedisClientService.getClient();
  await client.flushall();
}
```

**4. mongoose.mock.ts:**
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongoose } from '../../plugin/mongoose';

let mongoServer: MongoMemoryServer;

/**
 * Sets up in-memory MongoDB for testing
 */
export async function setupMongooseMock() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await Mongoose.init({ uri });
  
  return mongoServer;
}

/**
 * Clears all collections in test database
 */
export async function clearDatabase() {
  const collections = await Mongoose.getConnection().db.collections();
  
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

/**
 * Tears down MongoDB mock
 */
export async function teardownMongooseMock() {
  await Mongoose.disconnect();
  await mongoServer.stop();
}
```

**5. auth.ts (helpers):**
```typescript
import { JWTUtil } from '../../auth/util/jwt';

/**
 * Generates a test JWT token
 */
export function generateTestToken(payload: any, secret?: string): string {
  return JWTUtil.sign(
    payload,
    secret || 'test-secret',
    { expiresIn: '1h' }
  );
}

/**
 * Creates a test user payload
 */
export function createTestUser(overrides = {}) {
  return {
    id: '123',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}
```

### 3. Write Tests for Core Modules

**Test Structure:**
```
test/
├── setup.ts                        # Global test setup
├── unit/
│   ├── framework/
│   │   └── express-pack.spec.ts
│   ├── auth/
│   │   ├── jwt.spec.ts
│   │   └── middleware.spec.ts
│   ├── middleware/
│   │   └── validator.spec.ts
│   └── util/
│       ├── response.spec.ts
│       └── date.spec.ts
├── integration/
│   ├── routes/
│   │   └── user-routes.spec.ts
│   └── services/
│       ├── redis.spec.ts
│       └── mongoose.spec.ts
└── e2e/
    └── full-app.spec.ts
```

**Example Test:**

**test/unit/framework/express-pack.spec.ts:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { ExpressPack } from '../../../src/framework/express';

describe('ExpressPack', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
  });

  describe('init', () => {
    it('should initialize app with default config', async () => {
      const result = await ExpressPack.init({ app, config: {} });
      
      expect(result).toBe(app);
      expect(ExpressPack.isInitialized()).toBe(true);
    });

    it('should apply middleware in correct order', async () => {
      await ExpressPack.init({
        app,
        config: {
          bodyParser: {},
          cors: {},
          logger: { level: 'silent' },
        },
      });

      // Verify middleware stack
      const middlewareStack = app._router.stack;
      expect(middlewareStack.length).toBeGreaterThan(0);
    });

    it('should throw error if initialized twice', async () => {
      await ExpressPack.init({ app, config: {} });
      
      await expect(
        ExpressPack.init({ app, config: {} })
      ).rejects.toThrow();
    });
  });

  describe('getApp', () => {
    it('should return initialized app', async () => {
      await ExpressPack.init({ app, config: {} });
      
      const retrievedApp = ExpressPack.getApp();
      expect(retrievedApp).toBe(app);
    });

    it('should throw if app not initialized', () => {
      expect(() => ExpressPack.getApp()).toThrow(
        'Express app not initialized'
      );
    });
  });

  describe('getRouter', () => {
    it('should return new router instance', () => {
      const router1 = ExpressPack.getRouter();
      const router2 = ExpressPack.getRouter();
      
      expect(router1).toBeDefined();
      expect(router2).toBeDefined();
      expect(router1).not.toBe(router2);
    });
  });
});
```

**test/integration/routes/user-routes.spec.ts:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp, createTestRequest, setupMongooseMock, teardownMongooseMock } from '../../../src/testing';
import userRouter from '../../../examples/routes/user.router';

describe('User Routes Integration', () => {
  let app;
  let request;

  beforeEach(async () => {
    await setupMongooseMock();
    
    app = await createTestApp({
      routes: [userRouter],
      mocks: { mongoose: true, redis: true },
    });
    
    request = createTestRequest(app);
  });

  afterEach(async () => {
    await teardownMongooseMock();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should validate required fields', async () => {
      const res = await request
        .post('/users')
        .send({ name: 'John' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('email');
    });
  });
});
```

### 4. Add Package Scripts

Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run test/unit",
    "test:integration": "vitest run test/integration",
    "test:e2e": "vitest run test/e2e"
  }
}
```

### 5. Create Testing Documentation

File: `docs/testing-guide.md`

```markdown
# Testing Guide

## Overview

express-pack provides comprehensive testing utilities to help you test your Express applications.

## Installation

```bash
npm install --save-dev express-pack vitest supertest
```

## Quick Start

```typescript
import { createTestApp, createTestRequest } from 'express-pack/testing';
import { describe, it, expect } from 'vitest';

describe('My API', () => {
  it('should return 200', async () => {
    const app = await createTestApp();
    const request = createTestRequest(app);
    
    const res = await request.get('/health').expect(200);
    expect(res.body.status).toBe('ok');
  });
});
```

## Testing Utilities

### createTestApp()
[Documentation]

### createTestRequest()
[Documentation]

### Mocks
[Documentation]

### Helpers
[Documentation]

## Best Practices

1. Use in-memory databases for tests
2. Mock external services
3. Clean up after each test
4. Use descriptive test names
5. Test edge cases

## Examples

[Various examples]
```

---

## Implementation Steps

1. **Install Dependencies**
   ```bash
   npm install --save-dev vitest @vitest/ui supertest mongodb-memory-server ioredis-mock
   ```

2. **Create Vitest Config**
   - Create `vitest.config.ts`
   - Configure coverage thresholds

3. **Create Testing Utilities**
   - Implement `createTestApp`
   - Implement `createTestRequest`
   - Create mocks for services
   - Create test helpers

4. **Write Core Tests**
   - Test ExpressPack initialization
   - Test middleware
   - Test authentication
   - Test validation
   - Test utilities

5. **Write Integration Tests**
   - Test full route flows
   - Test service integrations

6. **Setup CI/CD**
   - Add test workflow to GitHub Actions
   - Add coverage reporting

7. **Document Testing**
   - Create testing guide
   - Add examples to README

---

## Verification

### Automated Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Check coverage thresholds met
# Should be 80%+ for lines, functions, branches, statements
```

### Manual Review

- [ ] All core modules have tests
- [ ] Test coverage meets 80% threshold
- [ ] Tests pass in CI/CD
- [ ] Testing utilities are documented
- [ ] Examples compile and run

---

## Success Metrics

- Test coverage: 80%+ (lines, functions, branches, statements)
- Test count: 100+ tests
- Test execution time: < 30 seconds
- CI/CD integration: Passing
- Documentation: Complete testing guide

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** High
- **Risk:** Low

---

## Dependencies

- None (can be done independently)

---

## Follow-up Tasks

- Add performance benchmarks
- Add mutation testing
- Add visual regression tests (for future UI components)
