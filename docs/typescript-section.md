## 🔷 TypeScript Support

express-pack is built with TypeScript-first design, providing full type safety and excellent IDE support.

### Type Exports

```typescript
import type {
  // Configuration Types
  MiddlewareConfig,
  RouteGroup,
  RouteItem,
  
  // Auth Types
  AuthConfig,
  JWTPayload,
  
  // Validation Types
  ValidationSchema,
  
  // Response Types
  ResponseFormat,
  
  // OpenAPI Types
  OpenAPIConfig,
  OpenAPISpec,
  RouteMetadata,
} from 'express-pack';
```

### Type-Safe Configuration

```typescript
import { ExpressPack, MiddlewareConfig } from 'express-pack';
import express, { Application } from 'express';

const config: MiddlewareConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  bodyParser: {
    json: { limit: '10mb' },
    urlencoded: { extended: true },
  },
  logger: {
    level: 'info',
  },
};

const app: Application = express();
await ExpressPack.init({ app, config });
```

### Extending Express Types

```typescript
// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      tenant?: {
        id: string;
        name: string;
      };
      requestId?: string;
      locale?: string;
    }
  }
}
```

### Generic Type Usage

```typescript
import { JWTUtil } from 'express-pack';

interface UserPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

// Type-safe JWT operations
const token = JWTUtil.sign<UserPayload>(
  { userId: '123', email: 'user@example.com', role: 'user' },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' }
);

const decoded = JWTUtil.verify<UserPayload>(
  token,
  process.env.JWT_SECRET!
);

console.log(decoded.userId); // Type-safe access
```

### Type-Safe Route Configuration

```typescript
import { RouteGroup } from 'express-pack';
import { Router } from 'express';

const userRouter: Router = ExpressPack.getRouter();
const authRouter: Router = ExpressPack.getRouter();

const routes: RouteGroup[] = [
  {
    prefix: '/api',
    version: '/v1',
    route: [
      { path: '/users', route: userRouter },
      { path: '/auth', route: authRouter },
    ],
  },
];

ExpressPack.initRoutes({ routes });
```

### Type-Safe Validation

```typescript
import { z } from 'zod';
import { RequestValidator } from 'express-pack';
import { Request, Response } from 'express';

const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

type UserInput = z.infer<typeof userSchema>;

router.post(
  '/users',
  RequestValidator.validateRequest({ body: userSchema }),
  (req: Request, res: Response) => {
    // req.body is now typed as UserInput
    const user: UserInput = req.body;
    res.json({ success: true, data: user });
  }
);
```

### Common TypeScript Patterns

**1. Typed Service Layer:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  static async findById(id: string): Promise<User | null> {
    return await User.findById(id);
  }

  static async create(data: Omit<User, 'id'>): Promise<User> {
    return await User.create(data);
  }
}
```

**2. Typed Middleware:**
```typescript
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  next();
};
```

**3. Typed Controllers:**
```typescript
import { Request, Response } from 'express';
import { ResponseUtil } from 'express-pack';

export class UserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const users = await UserService.findAll();
    ResponseUtil.send(req, res, 'SUCCESS', { users });
  }

  static async create(req: Request, res: Response): Promise<void> {
    const user = await UserService.create(req.body);
    ResponseUtil.send(req, res, 'CREATED', { user }, 201);
  }
}
```

### Type Inference

```typescript
// Zod schema with type inference
const configSchema = z.object({
  port: z.number().default(3000),
  env: z.enum(['development', 'production']),
});

type Config = z.infer<typeof configSchema>;
// Config is automatically: { port: number; env: 'development' | 'production' }
```

### Troubleshooting TypeScript Issues

**Issue: "Cannot find module 'express-pack' or its type declarations"**

Solution:
```bash
npm install express-pack
npm install --save-dev @types/express @types/node
```

**Issue: "Property 'user' does not exist on type 'Request'"**

Solution: Extend Express types (see above)

**Issue: Type errors with middleware**

Solution: Use proper Express types:
```typescript
import { RequestHandler } from 'express';

const middleware: RequestHandler = (req, res, next) => {
  // Properly typed
  next();
};
```

---
