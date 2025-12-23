# Express-Pack Multi-Tenant SaaS Example

Advanced multi-tenant SaaS application demonstrating tenant isolation, scoped queries, and subscription management.

## Features

- ✅ **Tenant Isolation** - Complete data separation per tenant
- ✅ **Tenant Middleware** - Automatic tenant context injection
- ✅ **Scoped Queries** - Tenant-scoped database queries
- ✅ **Subscription Management** - Tenant subscription tracking
- ✅ **Usage Tracking** - Per-tenant usage metrics
- ✅ **Tenant-Specific Caching** - Isolated cache per tenant
- ✅ **Multi-Database Support** - Optional separate DB per tenant
- ✅ **All REST API Features** - Plus multi-tenancy

## Architecture

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Tenant Middleware│ ← Extract tenant from header/subdomain
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Tenant Context │ ← Inject tenant into request
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Scoped Queries  │ ← Auto-filter by tenant
└─────────────────┘
```

## Key Implementation

### 1. Tenant Middleware

```typescript
// middleware/tenant.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../model/tenant.model';

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract tenant ID from header
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      error: 'Tenant ID required in X-Tenant-ID header',
    });
  }

  // Fetch tenant
  const tenant = await Tenant.findById(tenantId);

  if (!tenant || !tenant.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found or inactive',
    });
  }

  // Check subscription status
  if (tenant.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Subscription inactive',
    });
  }

  // Inject tenant into request
  req.tenant = tenant;
  next();
}
```

### 2. Tenant Model

```typescript
// model/tenant.model.ts
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'inactive', 'trial'], default: 'trial' },
    expiresAt: Date,
  },
  limits: {
    users: { type: Number, default: 5 },
    storage: { type: Number, default: 1024 }, // MB
    apiCalls: { type: Number, default: 1000 }, // per month
  },
  usage: {
    users: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Tenant = mongoose.model('Tenant', tenantSchema);
```

### 3. Tenant-Scoped User Model

```typescript
// model/user.model.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// Compound index for tenant isolation
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
```

### 4. Scoped Service

```typescript
// service/user.service.ts
export class UserService {
  static async create(tenantId: string, data: any) {
    // Automatically scope to tenant
    const user = await User.create({
      ...data,
      tenantId,
    });
    return user;
  }

  static async findAll(tenantId: string) {
    // All queries scoped to tenant
    return await User.find({ tenantId });
  }

  static async findById(tenantId: string, userId: string) {
    return await User.findOne({ _id: userId, tenantId });
  }

  static async update(tenantId: string, userId: string, data: any) {
    return await User.findOneAndUpdate(
      { _id: userId, tenantId },
      data,
      { new: true }
    );
  }
}
```

### 5. Usage Tracking

```typescript
// middleware/usage-tracking.middleware.ts
export async function trackUsage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenant = req.tenant;

  // Increment API call count
  await Tenant.findByIdAndUpdate(tenant._id, {
    $inc: { 'usage.apiCalls': 1 },
  });

  // Check limits
  if (tenant.usage.apiCalls >= tenant.limits.apiCalls) {
    return res.status(429).json({
      success: false,
      error: 'API call limit exceeded',
    });
  }

  next();
}
```

## Usage

### 1. Create Tenant

```bash
curl -X POST http://localhost:3000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "subdomain": "acme"
  }'
```

### 2. Make Tenant-Scoped Request

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "X-Tenant-ID: 507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Benefits

- 🔒 **Complete Isolation** - Data never leaks between tenants
- 📊 **Usage Tracking** - Monitor per-tenant resource usage
- 💰 **Subscription Management** - Built-in billing support
- 🚀 **Scalable** - Easy to scale per tenant
- 🔍 **Audit Trail** - Track all tenant activities

## Learn More

See the complete implementation in `examples/multitenant/`

## License

MIT
