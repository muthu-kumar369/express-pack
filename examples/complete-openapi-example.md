# Complete OpenAPI Integration Example

This example shows how to add OpenAPI metadata to routes for comprehensive API documentation.

## Setup

```typescript
import { ExpressPack } from 'express-pack';
import { z } from 'zod';
import { RequestValidator } from 'express-pack';
import express from 'express';

const app = express();

await ExpressPack.init({ app, config: {} });
```

## Define Schemas with Zod

```typescript
const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['user', 'admin']).optional(),
});

const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  age: z.number().min(18).max(120).optional(),
});

const userIdSchema = z.object({
  id: z.string().uuid(),
});
```

## Create Routes with Validation

```typescript
const userRouter = ExpressPack.getRouter();

// GET /users - List all users
userRouter.get('/', async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

// GET /users/:id - Get user by ID
userRouter.get(
  '/:id',
  RequestValidator.validateRequest({ params: userIdSchema }),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  }
);

// POST /users - Create new user
userRouter.post(
  '/',
  RequestValidator.validateRequest({ body: userCreateSchema }),
  async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  }
);

// PUT /users/:id - Update user
userRouter.put(
  '/:id',
  RequestValidator.validateRequest({
    params: userIdSchema,
    body: userUpdateSchema,
  }),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  }
);

// DELETE /users/:id - Delete user
userRouter.delete(
  '/:id',
  RequestValidator.validateRequest({ params: userIdSchema }),
  async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(204).send();
  }
);
```

## Initialize Routes with OpenAPI

```typescript
ExpressPack.initRoutes({
  routes: [
    {
      prefix: '/api',
      version: '/v1',
      route: [
        { path: '/users', route: userRouter },
      ],
    },
  ],
  openapi: {
    enabled: true,
    output: './openapi.json',
    ui: '/api-docs',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'Complete API for managing users with validation and documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
      { url: 'https://staging-api.example.com', description: 'Staging server' },
      { url: 'https://api.example.com', description: 'Production server' },
    ],
  },
});
```

## Start Server

```typescript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`OpenAPI Spec: ./openapi.json`);
});
```

## Result

When you run this example:

1. **Server starts** on http://localhost:3000
2. **API endpoints** available at:
   - GET /api/v1/users
   - GET /api/v1/users/:id
   - POST /api/v1/users
   - PUT /api/v1/users/:id
   - DELETE /api/v1/users/:id

3. **Swagger UI** available at http://localhost:3000/api-docs
4. **OpenAPI spec** saved to ./openapi.json

## What Gets Documented

The OpenAPI spec will include:

- ✅ All route paths and methods
- ✅ Request parameters (path, query, body)
- ✅ Request body schemas (from Zod)
- ✅ Response schemas
- ✅ Validation rules
- ✅ Server configurations
- ✅ Authentication requirements

## Testing from Swagger UI

1. Navigate to http://localhost:3000/api-docs
2. Expand any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. View response

## Benefits

- 📖 **Always Up-to-Date**: Documentation generated from actual code
- 🔍 **Interactive Testing**: Test endpoints directly from browser
- ✅ **Type-Safe**: Zod schemas ensure validation matches docs
- 🚀 **Zero Maintenance**: No manual documentation updates needed
- 🌍 **Multi-Environment**: Easy switching between dev/staging/prod

---

This example demonstrates the complete integration of OpenAPI with express-pack, providing automatic, always-current API documentation.
