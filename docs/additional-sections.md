## ⚡ Performance Optimization

### Caching Strategies

**Redis Caching:**
```typescript
import { RedisClientService } from 'express-pack';

// Cache frequently accessed data
const cacheKey = `user:${userId}`;
const cached = await RedisClientService.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await fetchFromDatabase(userId);
await RedisClientService.set(cacheKey, JSON.stringify(data), { expire: 3600 });
```

**Query Optimization:**
```typescript
// Use indexes
userSchema.index({ email: 1 });
userSchema.index({ tenantId: 1, email: 1 });

// Select only needed fields
const users = await User.find().select('name email').lean();

// Use pagination
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### Connection Pooling

**MongoDB:**
```typescript
await Mongoose.init({
  uri: process.env.DB_URL!,
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
  },
});
```

**Redis:**
```typescript
await RedisClientService.init({
  enabled: true,
  host: process.env.REDIS_HOST!,
  port: 6379,
  maxRetriesPerRequest: 3,
});
```

### Rate Limiting

```typescript
const config: MiddlewareConfig = {
  'express-rate-limit': {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  },
};
```

### Compression

```typescript
const config: MiddlewareConfig = {
  compression: {
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
  },
};
```

---

## ✅ Best Practices & Anti-Patterns

### ✅ Best Practices

**1. Use Environment Variables**
```typescript
// ✅ Good
const secret = process.env.JWT_SECRET!;

// ❌ Bad
const secret = 'hardcoded-secret';
```

**2. Validate All Inputs**
```typescript
// ✅ Good
router.post('/', 
  RequestValidator.validateRequest({ body: userSchema }),
  handler
);

// ❌ Bad
router.post('/', (req, res) => {
  const user = await User.create(req.body); // No validation!
});
```

**3. Use Async Error Handling**
```typescript
// ✅ Good
router.get('/', AsyncRouteWrapper.asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));

// ❌ Bad
router.get('/', async (req, res) => {
  const data = await fetchData(); // Unhandled promise rejection!
  res.json(data);
});
```

**4. Implement Proper Logging**
```typescript
// ✅ Good
Logger.info('User created', { userId: user.id });
Logger.error('Database error', { error: err.message });

// ❌ Bad
console.log('User created');
```

**5. Use Soft Deletes**
```typescript
// ✅ Good
userSchema.plugin(SoftDeletePlugin);
await user.softDelete();

// ❌ Bad
await User.findByIdAndDelete(id);
```

### ❌ Anti-Patterns

**1. Blocking the Event Loop**
```typescript
// ❌ Bad
app.get('/heavy', (req, res) => {
  const result = heavySyncOperation(); // Blocks!
  res.json(result);
});

// ✅ Good
app.get('/heavy', async (req, res) => {
  const result = await heavyAsyncOperation();
  res.json(result);
});
```

**2. Not Handling Errors**
```typescript
// ❌ Bad
router.get('/', async (req, res) => {
  const data = await db.query(); // What if this fails?
  res.json(data);
});

// ✅ Good
router.get('/', AsyncRouteWrapper.asyncHandler(async (req, res) => {
  const data = await db.query();
  ResponseUtil.send(req, res, 'SUCCESS', data);
}));
```

**3. Exposing Sensitive Data**
```typescript
// ❌ Bad
res.json(user); // Includes password hash!

// ✅ Good
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
```

**4. Not Using Transactions**
```typescript
// ❌ Bad
await User.create(userData);
await Account.create(accountData); // What if this fails?

// ✅ Good
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await User.create([userData], { session });
  await Account.create([accountData], { session });
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot find module 'express-pack'"

**Cause:** Package not installed or wrong import path

**Solution:**
```bash
npm install express-pack
```

```typescript
// ✅ Correct
import { ExpressPack } from 'express-pack';

// ❌ Wrong
import ExpressPack from 'express-pack';
```

#### 2. "JWT Secret Not Defined"

**Cause:** Missing environment variable

**Solution:**
```bash
# .env
JWT_SECRET=your-secret-key-here
REFRESH_SECRET=your-refresh-secret-here
```

```typescript
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}
```

#### 3. "MongoDB Connection Failed"

**Cause:** Wrong connection string or MongoDB not running

**Solution:**
```typescript
// Check connection string
const dbUrl = process.env.DB_URL; // mongodb://localhost:27017/mydb

// Add error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Test connection
await mongoose.connect(dbUrl, {
  serverSelectionTimeoutMS: 5000,
});
```

#### 4. "Redis Connection Refused"

**Cause:** Redis not running or wrong host/port

**Solution:**
```bash
# Start Redis
redis-server

# Or with Docker
docker run -d -p 6379:6379 redis
```

```typescript
await RedisClientService.init({
  enabled: true,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});
```

#### 5. "Validation Error: Expected object, received undefined"

**Cause:** Missing request body or wrong content-type

**Solution:**
```typescript
// Ensure body-parser is configured
const config: MiddlewareConfig = {
  bodyParser: {
    json: { limit: '10mb' },
  },
};

// Send correct content-type
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Debug Mode

Enable debug logging:
```typescript
const config: MiddlewareConfig = {
  logger: {
    level: 'debug',
  },
};
```

### Getting Help

- 📖 [Documentation](https://muthu-kumar369.github.io/express-pack/)
- 🐛 [GitHub Issues](https://github.com/muthu-kumar369/express-pack/issues)
- 💬 [Discussions](https://github.com/muthu-kumar369/express-pack/discussions)

---
