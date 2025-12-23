# Express-Pack REST API Example

A complete REST API example demonstrating express-pack features including authentication, validation, caching, and API documentation.

## Features

- ✅ **User Authentication** - JWT-based auth with access and refresh tokens
- ✅ **CRUD Operations** - Complete user management
- ✅ **Request Validation** - Zod schema validation
- ✅ **MongoDB Integration** - Mongoose with soft delete and timestamps
- ✅ **Redis Caching** - Automatic caching for improved performance
- ✅ **API Documentation** - Auto-generated Swagger UI
- ✅ **Error Handling** - Centralized error handling
- ✅ **Logging** - Request/response logging
- ✅ **Security** - Rate limiting, CORS, helmet
- ✅ **TypeScript** - Full type safety

## Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- Redis 6+

## Installation

```bash
# Clone or copy this example
cd examples/rest-api

# Install dependencies
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
REFRESH_SECRET=your-refresh-secret
```

## Running

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Users (Protected)

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Other

- `GET /health` - Health check
- `GET /api-docs` - Swagger UI documentation

## API Documentation

Visit http://localhost:3000/api-docs for interactive API documentation.

## Example Requests

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Users (with auth)

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
src/
├── config/
│   ├── app.config.ts       # Middleware configuration
│   ├── route.config.ts     # Route configuration
│   └── message.config.ts   # Response messages
├── modules/
│   ├── auth/
│   │   ├── controller/     # Auth controllers
│   │   └── router/         # Auth routes
│   └── user/
│       ├── model/          # User model
│       ├── service/        # Business logic
│       ├── controller/     # Request handlers
│       └── router/         # Route definitions
└── app.ts                  # Application entry point
```

## Key Features Demonstrated

### 1. Authentication & Authorization

```typescript
// JWT authentication
AuthMiddleware.authenticateUser({
  secret: process.env.JWT_SECRET!,
  headerKey: 'authorization',
  usingBearer: true,
})

// Role-based authorization
AuthMiddleware.authorizeRole({ allowedRoles: ['admin'] })
```

### 2. Request Validation

```typescript
const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

RequestValidator.validateRequest({ body: createUserSchema })
```

### 3. Redis Caching

```typescript
// Automatic caching in service layer
const cached = await RedisClientService.get(cacheKey);
if (cached) return JSON.parse(cached);

// Cache for 1 hour
await RedisClientService.set(cacheKey, JSON.stringify(user), { expire: 3600 });
```

### 4. Mongoose Plugins

```typescript
userSchema.plugin(SoftDeletePlugin);
userSchema.plugin(TimestampPlugin);
```

### 5. OpenAPI Documentation

```typescript
ExpressPack.initRoutes({
  routes: routeConfig.routes,
  openapi: {
    enabled: true,
    ui: '/api-docs',
    // ...
  },
});
```

## Learn More

- [express-pack Documentation](https://github.com/muthu-kumar369/express-pack)
- [API Reference](https://muthu-kumar369.github.io/express-pack/)

## License

MIT
