---

## 📖 OpenAPI/Swagger Integration

express-pack includes built-in support for automatic API documentation generation using OpenAPI 3.0 and Swagger UI.

### Quick Start

Enable OpenAPI documentation when initializing routes:

```typescript
import { ExpressPack } from 'express-pack';

ExpressPack.initRoutes({
  routes: routeConfig.routes,
  openapi: {
    enabled: true,
    output: './openapi.json',
    ui: '/api-docs',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.example.com', description: 'Production' },
    ],
  },
});
```

Access your API documentation at: `http://localhost:3000/api-docs`

### Configuration Options

```typescript
interface OpenAPIConfig {
  enabled?: boolean;          // Enable/disable OpenAPI generation
  output?: string;            // Path to save spec file (e.g., './openapi.json')
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

### Features

- ✅ **Automatic Spec Generation**: OpenAPI 3.0 specs generated from routes
- ✅ **Interactive UI**: Swagger UI for testing endpoints
- ✅ **Zod Integration**: Automatic schema conversion from Zod validators
- ✅ **JWT Documentation**: Bearer token authentication documented
- ✅ **Multi-Environment**: Support for multiple server configurations
- ✅ **File Export**: Save specs to JSON files

### Example with Zod Validation

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

The Zod schema will automatically be converted to OpenAPI schema in the documentation.

### Complete Example

See [examples/openapi-integration.md](./examples/openapi-integration.md) for a complete working example.

---
