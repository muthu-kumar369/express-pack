# OpenAPI/Swagger Integration Example

This example demonstrates how to use the OpenAPI integration in express-pack.

## Basic Setup

```typescript
import { ExpressPack } from 'express-pack';
import express from 'express';

const app = express();

// Initialize ExpressPack
await ExpressPack.init({ app, config: {} });

// Create routers
const userRouter = ExpressPack.getRouter();
userRouter.get('/', (req, res) => {
  res.json({ users: [] });
});

userRouter.post('/', (req, res) => {
  res.status(201).json({ success: true });
});

// Initialize routes with OpenAPI
ExpressPack.initRoutes({
  routes: [{
    prefix: '/api',
    version: '/v1',
    route: [
      { path: '/users', route: userRouter }
    ]
  }],
  openapi: {
    enabled: true,
    output: './openapi.json',
    ui: '/api-docs',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My awesome API documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.example.com', description: 'Production' },
    ],
  },
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API docs available at http://localhost:3000/api-docs');
});
```

## With Zod Validation

```typescript
import { z } from 'zod';
import { RequestValidator } from 'express-pack';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

const userRouter = ExpressPack.getRouter();

userRouter.post(
  '/',
  RequestValidator.validateRequest({ body: userSchema }),
  (req, res) => {
    res.status(201).json({ success: true, data: req.body });
  }
);
```

## Configuration Options

### OpenAPI Config

```typescript
interface OpenAPIConfig {
  enabled?: boolean;          // Enable/disable OpenAPI generation
  output?: string;            // Path to save OpenAPI spec file
  ui?: string | false;        // Swagger UI path or false to disable
  info?: {
    title?: string;           // API title
    version?: string;         // API version
    description?: string;     // API description
  };
  servers?: Array<{
    url: string;              // Server URL
    description?: string;     // Server description
  }>;
}
```

## Accessing Documentation

Once configured, you can access:

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec**: ./openapi.json (if output specified)

## Features

- ✅ Automatic OpenAPI 3.0 spec generation
- ✅ Swagger UI integration
- ✅ Zod schema to OpenAPI conversion
- ✅ JWT authentication documentation
- ✅ Multiple server environments
- ✅ File export support
