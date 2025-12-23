# Task 1: Shared Packages Creation

## Context

express-pack and react-pack currently duplicate code for types, validation schemas, constants, and utilities. This creates maintenance overhead and potential inconsistencies.

## Objective

Create shared packages that can be used by both backend and frontend, ensuring type safety and DRY principles across the full stack.

---

## Shared Packages

### 1. @fullstack-pack/types

**Purpose:** Shared TypeScript type definitions

**Package Structure:**
```
packages/shared-types/
├── src/
│   ├── api/
│   │   ├── request.ts         # API request types
│   │   ├── response.ts        # API response types
│   │   └── error.ts           # Error types
│   ├── models/
│   │   ├── user.ts            # User types
│   │   ├── auth.ts            # Auth types
│   │   └── common.ts          # Common model types
│   ├── config/
│   │   └── index.ts           # Configuration types
│   └── index.ts
└── package.json
```

**Implementation:**

**src/api/response.ts:**
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  code: string;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: Required<ResponseMeta>;
}
```

**src/models/user.ts:**
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}
```

### 2. @fullstack-pack/schemas

**Purpose:** Shared Zod validation schemas

**Implementation:**

**src/user.schema.ts:**
```typescript
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateUserSchema = userSchema.partial().omit({ password: true });

// Export inferred types
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

**Usage in Backend:**
```typescript
import { RequestValidator } from '@express-pack/validation';
import { userSchema } from '@fullstack-pack/schemas';

router.post(
  '/users',
  RequestValidator.validateRequest({ body: userSchema }),
  AsyncRouteWrapper.asyncHandler(createUser)
);
```

**Usage in Frontend:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@fullstack-pack/schemas';

const form = useForm({
  resolver: zodResolver(userSchema),
});
```

### 3. @fullstack-pack/constants

**Purpose:** Shared constants and enums

**Implementation:**

**src/error-codes.ts:**
```typescript
export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
```

**src/http-status.ts:**
```typescript
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### 4. @fullstack-pack/utils

**Purpose:** Shared utility functions

**Implementation:**

**src/date.ts:**
```typescript
import { format, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatStr = 'yyyy-MM-dd') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

export const isExpired = (expiryDate: Date | string) => {
  const expiry = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  return expiry < new Date();
};
```

**src/string.ts:**
```typescript
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (text: string, length: number): string => {
  return text.length > length ? text.slice(0, length) + '...' : text;
};
```

### 5. @fullstack-pack/auth

**Purpose:** Shared authentication utilities

**Implementation:**

**src/jwt.ts:**
```typescript
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const createToken = (payload: JWTPayload, secret: string, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JWTPayload => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
```

### 6. @fullstack-pack/i18n

**Purpose:** Shared translation messages

**Implementation:**

**src/messages/en.ts:**
```typescript
export const enMessages = {
  errors: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_CREDENTIALS: 'Invalid email or password',
    VALIDATION_ERROR: 'Please check your input and try again',
    NOT_FOUND: 'The requested resource was not found',
  },
  success: {
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login successful',
    UPDATE_SUCCESS: 'Updated successfully',
  },
};
```

---

## Implementation Steps

1. **Create Package Structure**
   ```bash
   mkdir -p packages/shared-{types,schemas,constants,utils,auth,i18n}
   ```

2. **Setup Each Package**
   - Create package.json
   - Create tsconfig.json
   - Create src/index.ts

3. **Implement Shared Code**
   - Move duplicated code from express-pack and react-pack
   - Ensure compatibility with both environments

4. **Update Dependencies**
   - Update express-pack to use shared packages
   - Update react-pack to use shared packages

5. **Test Integration**
   - Test in backend
   - Test in frontend
   - Verify type safety

6. **Publish Packages**
   ```bash
   lerna publish
   ```

---

## Verification

```bash
# Build all shared packages
lerna run build --scope @fullstack-pack/*

# Test in backend
cd apps/backend
npm install @fullstack-pack/types @fullstack-pack/schemas

# Test in frontend
cd apps/frontend
npm install @fullstack-pack/types @fullstack-pack/schemas
```

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** Medium
- **Risk:** Low
