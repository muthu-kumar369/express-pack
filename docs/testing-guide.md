# Testing Guide

## Overview

express-pack provides comprehensive testing utilities to help you test your Express applications with ease.

## Installation

```bash
npm install --save-dev vitest supertest @types/supertest
```

## Quick Start

```typescript
import { createTestApp, createTestRequest } from 'express-pack/testing';
import { describe, it, expect } from 'vitest';

describe('My API', () => {
  it('should return 200 for health check', async () => {
    const app = await createTestApp();
    const request = createTestRequest(app);
    
    const res = await request.get('/health').expect(200);
    expect(res.body.status).toBe('ok');
  });
});
```

## Testing Utilities

### createTestApp()

Creates a test Express application with express-pack initialized.

```typescript
import { createTestApp } from 'express-pack/testing';

const app = await createTestApp({
  routes: [userRouter, postRouter],
  config: {
    cors: {},
    bodyParser: { json: { limit: '10mb' } }
  }
});
```

### createTestRequest()

Creates a supertest instance for making HTTP requests.

```typescript
import { createTestRequest } from 'express-pack/testing';

const request = createTestRequest(app);
const res = await request.get('/users').expect(200);
```

### createAuthenticatedRequest()

Creates a supertest instance with authentication header.

```typescript
import { createAuthenticatedRequest, generateTestToken } from 'express-pack/testing';

const token = generateTestToken({ userId: '123', role: 'admin' });
const request = createAuthenticatedRequest(app, token);

const res = await request.get('/profile').expect(200);
```

### generateTestToken()

Generates a JWT token for testing.

```typescript
import { generateTestToken } from 'express-pack/testing';

const token = generateTestToken({
  userId: '123',
  role: 'admin',
  email: 'admin@example.com'
});
```

### createTestUser()

Creates a test user payload.

```typescript
import { createTestUser } from 'express-pack/testing';

const user = createTestUser({ role: 'admin' });
// { id: '123', email: 'test@example.com', name: 'Test User', role: 'admin' }
```

## Examples

### Testing Routes

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestApp, createTestRequest } from 'express-pack/testing';
import userRouter from './routes/user.router.js';

describe('User Routes', () => {
  let app;
  let request;

  beforeEach(async () => {
    app = await createTestApp({ routes: [userRouter] });
    request = createTestRequest(app);
  });

  it('should create a new user', async () => {
    const res = await request
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('should validate required fields', async () => {
    const res = await request
      .post('/users')
      .send({ name: 'John' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});
```

### Testing Authentication

```typescript
import { describe, it, expect } from 'vitest';
import { 
  createTestApp, 
  createAuthenticatedRequest,
  generateTestToken 
} from 'express-pack/testing';

describe('Protected Routes', () => {
  it('should access protected route with valid token', async () => {
    const app = await createTestApp({ routes: [protectedRouter] });
    const token = generateTestToken({ userId: '123', role: 'user' });
    const request = createAuthenticatedRequest(app, token);

    const res = await request.get('/profile').expect(200);
    expect(res.body.user.id).toBe('123');
  });

  it('should reject request without token', async () => {
    const app = await createTestApp({ routes: [protectedRouter] });
    const request = createTestRequest(app);

    await request.get('/profile').expect(401);
  });
});
```

## Best Practices

1. **Use in-memory databases** for tests
2. **Mock external services** (Redis, RabbitMQ, etc.)
3. **Clean up after each test** using `beforeEach`/`afterEach`
4. **Use descriptive test names** that explain what is being tested
5. **Test edge cases** and error scenarios
6. **Keep tests isolated** - each test should be independent

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Configuration

Tests are configured in `vitest.config.ts`. You can customize:
- Test environment
- Coverage thresholds
- Setup files
- Path aliases

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [express-pack API Documentation](https://muthu-kumar369.github.io/express-pack/)
