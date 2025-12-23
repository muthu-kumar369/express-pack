# Task 6: Example Projects Creation

## Context

express-pack currently has no example projects or starter templates. Developers must piece together documentation to understand how to use the library in real-world scenarios. This creates a steep learning curve and slows adoption.

## Objective

Create 3 comprehensive example projects that demonstrate express-pack usage in different scenarios:
1. **REST API** - Basic CRUD application
2. **Multi-Tenant SaaS** - Advanced multi-tenant application
3. **Microservice** - Microservice with queue and caching

---

## Requirements

### Example 1: REST API (Basic)

**Project Name:** `express-pack-rest-api-example`

**Features:**
- User authentication (JWT)
- CRUD operations
- Request validation (Zod)
- MongoDB integration
- Redis caching
- API documentation (Swagger)
- Error handling
- Logging

**File Structure:**
```
examples/rest-api/
├── src/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── route.config.ts
│   │   ├── message.config.ts
│   │   └── locale/
│   │       └── en.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── model/
│   │   │   └── router/
│   │   └── user/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       └── router/
│   ├── loaders/
│   │   └── index.ts
│   └── app.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

**Implementation:**

**1. app.config.ts:**
```typescript
import { MiddlewareConfig } from 'express-pack';

export const appConfig: MiddlewareConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  bodyParser: {
    json: { limit: '10mb' },
    urlencoded: { extended: true, limit: '10mb' },
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  security: {
    contentSecurityPolicy: false,
  },
  compression: {
    level: 6,
    threshold: 1024,
  },
  'express-rate-limit': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
```

**2. User Module Example:**

**user.model.ts:**
```typescript
import mongoose from 'mongoose';
import { SoftDeletePlugin, TimestampPlugin } from 'express-pack';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

userSchema.plugin(SoftDeletePlugin);
userSchema.plugin(TimestampPlugin);

export const User = mongoose.model('User', userSchema);
```

**user.service.ts:**
```typescript
import { User } from '../model/user.model';
import { EncryptionUtil, RedisClientService } from 'express-pack';

export class UserService {
  static async create(data: any) {
    const hashedPassword = await EncryptionUtil.hash(data.password);
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  static async findById(id: string) {
    const cacheKey = `user:${id}`;
    
    // Try cache first
    const cached = await RedisClientService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Fetch from DB
    const user = await User.findById(id);
    
    // Cache for 1 hour
    if (user) {
      await RedisClientService.set(cacheKey, JSON.stringify(user), { expire: 3600 });
    }

    return user;
  }

  static async update(id: string, data: any) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    
    // Invalidate cache
    await RedisClientService.del(`user:${id}`);
    
    return user;
  }

  static async delete(id: string) {
    await User.softDelete(id);
    await RedisClientService.del(`user:${id}`);
  }
}
```

**user.router.ts:**
```typescript
import { ExpressPack, RequestValidator, AuthMiddleware, AsyncRouteWrapper } from 'express-pack';
import { z } from 'zod';
import { UserController } from '../controller/user.controller';

const router = ExpressPack.getRouter();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

// Public routes
router.post(
  '/',
  RequestValidator.validateRequest({ body: createUserSchema }),
  AsyncRouteWrapper.asyncHandler(UserController.create)
);

// Protected routes
router.get(
  '/:id',
  AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET! }),
  AsyncRouteWrapper.asyncHandler(UserController.getById)
);

router.put(
  '/:id',
  AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET! }),
  RequestValidator.validateRequest({ body: updateUserSchema }),
  AsyncRouteWrapper.asyncHandler(UserController.update)
);

router.delete(
  '/:id',
  AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET! }),
  AsyncRouteWrapper.asyncHandler(UserController.delete)
);

export default router;
```

**3. README.md:**
```markdown
# Express-Pack REST API Example

A complete REST API example using express-pack.

## Features

- ✅ User authentication (JWT)
- ✅ CRUD operations
- ✅ Request validation (Zod)
- ✅ MongoDB integration
- ✅ Redis caching
- ✅ API documentation (Swagger)
- ✅ Error handling
- ✅ Logging

## Prerequisites

- Node.js 16+
- MongoDB
- Redis

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and update values:

```env
PORT=3000
DB_URL=mongodb://localhost:27017/express-pack-example
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

## Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Documentation

Visit http://localhost:3000/api-docs for Swagger UI

## Testing

```bash
npm test
```

## Project Structure

[Explanation of folder structure]

## Learn More

- [express-pack Documentation](https://github.com/muthu-kumar369/express-pack)
- [API Reference](https://muthu-kumar369.github.io/express-pack/)
```

### Example 2: Multi-Tenant SaaS (Advanced)

**Project Name:** `express-pack-multitenant-example`

**Additional Features:**
- Tenant isolation
- Tenant-scoped queries
- Tenant-specific caching
- Tenant middleware
- Subscription management
- Usage tracking

**Key Implementation:**

**tenant.middleware.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../model/tenant.model';

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      error: 'Tenant ID required',
    });
  }

  const tenant = await Tenant.findById(tenantId);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found',
    });
  }

  req.tenant = tenant;
  next();
}
```

### Example 3: Microservice (Advanced)

**Project Name:** `express-pack-microservice-example`

**Additional Features:**
- RabbitMQ message queue
- Cron jobs
- Email notifications
- File upload (S3)
- Payment processing (Stripe)
- Metrics and monitoring

**Key Implementation:**

**queue.service.ts:**
```typescript
import { RabbitMQService } from 'express-pack';

export class QueueService {
  static async init() {
    await RabbitMQService.init({
      enabled: true,
      uri: process.env.RABBITMQ_URI!,
      exchanges: [
        { name: 'notifications', type: 'topic' },
      ],
      queues: [
        { name: 'email-queue', options: { durable: true } },
        { name: 'sms-queue', options: { durable: true } },
      ],
    });

    // Setup consumers
    await this.setupConsumers();
  }

  static async setupConsumers() {
    await RabbitMQService.consume(
      'email-queue',
      async (message) => {
        // Process email
        console.log('Processing email:', message);
      },
      { retryAttempts: 3 }
    );
  }

  static async publishEmail(data: any) {
    await RabbitMQService.publishToQueue('email-queue', data);
  }
}
```

---

## Implementation Steps

1. **Create Project Directories**
   ```bash
   mkdir -p examples/{rest-api,multitenant,microservice}
   ```

2. **Setup Each Project**
   - Initialize package.json
   - Add dependencies
   - Create folder structure
   - Implement features

3. **Add Documentation**
   - README for each project
   - Code comments
   - API documentation

4. **Test Each Project**
   - Write tests
   - Manual testing
   - Fix bugs

5. **Create Deployment Guides**
   - Docker setup
   - Environment configuration
   - Production checklist

6. **Publish Examples**
   - Push to GitHub
   - Link from main README
   - Create demo videos (optional)

---

## Verification

### Automated Tests

Each example should have:
```bash
npm test
npm run build
```

### Manual Testing

1. Clone example project
2. Follow README instructions
3. Verify all features work
4. Test API endpoints
5. Check Swagger documentation

---

## Success Metrics

- 3 example projects created
- All examples have README
- All examples have tests
- All examples build successfully
- All examples run without errors
- Positive user feedback

---

## Estimated Effort

- **Time:** 3 days (1 day per example)
- **Complexity:** Medium
- **Risk:** Low

---

## Dependencies

- Task 1: README (for linking examples)
- Task 5: OpenAPI (for Swagger in examples)

---

## Follow-up Tasks

- Create video tutorials
- Add more advanced examples
- Create deployment templates (Docker, K8s)
