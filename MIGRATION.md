# Migration Guide: v1.x → v2.0.0

## 📋 Table of Contents

1. [Overview](#overview)
2. [Breaking Changes](#breaking-changes)
3. [Step-by-Step Migration](#step-by-step-migration)
4. [Automated Migration Tool](#automated-migration-tool)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Rollback Instructions](#rollback-instructions)
7. [Getting Help](#getting-help)

---

## 🎯 Overview

### Why Upgrade to v2.0.0?

express-pack v2.0.0 is a major rewrite that brings:

- ✅ **Full TypeScript Support** - Better type safety and IDE autocomplete
- ✅ **ESM Modules** - Modern JavaScript module system
- ✅ **Improved API Design** - More consistent and intuitive APIs
- ✅ **Better Documentation** - Comprehensive JSDoc and TypeDoc
- ✅ **New Features** - Enhanced validation, authentication, and utilities
- ✅ **Performance Improvements** - Optimized middleware and caching

### What's New in v2.0.0?

- **TypeScript-first** - Written entirely in TypeScript
- **ESM modules** - Uses `import/export` instead of `require`
- **Async initialization** - `ExpressPack.init()` now returns a Promise
- **Object-based parameters** - Better extensibility and readability
- **Zod validation** - Type-safe request validation
- **Comprehensive JSDoc** - Full API documentation
- **New utilities** - Date utilities, enhanced encryption, JWT helpers

### Who Should Upgrade?

- ✅ Projects using Node.js 16+
- ✅ Projects ready to adopt ESM
- ✅ Projects wanting TypeScript support
- ✅ Projects needing better type safety

### Estimated Migration Time

- **Small projects** (< 10 routes): 30 minutes - 1 hour
- **Medium projects** (10-50 routes): 2-4 hours
- **Large projects** (50+ routes): 1 day

---

## 💥 Breaking Changes

### 1. Module System: CommonJS → ESM

**v1.x (CommonJS):**
```javascript
const { ExpressPack } = require('express-pack');
```

**v2.0.0 (ESM):**
```typescript
import { ExpressPack } from 'express-pack';
```

**Impact:** 🔴 **HIGH** - Affects all imports

**Migration:**
1. Add `"type": "module"` to `package.json`
2. Change all `require()` to `import`
3. Change all `module.exports` to `export`
4. Use `.js` extension in relative imports

---

### 2. ExpressPack Initialization

**v1.x:**
```javascript
ExpressPack.init(app, config);
```

**v2.0.0:**
```typescript
await ExpressPack.init({ app, config });
```

**Changes:**
- ✅ Now returns a Promise (requires `await`)
- ✅ Parameters wrapped in object `{ app, config }`
- ✅ Better extensibility for future options

**Impact:** 🔴 **HIGH** - Affects app initialization

**Migration:**
```typescript
// Before
ExpressPack.init(app, config);

// After
await ExpressPack.init({ app, config });

// Or in non-async context
ExpressPack.init({ app, config }).then(() => {
  // App initialized
});
```

---

### 3. Configuration Format

**v1.x:**
```javascript
const config = {
  cors: true,
  bodyParser: true,
  logger: true,
};
```

**v2.0.0:**
```typescript
const config: MiddlewareConfig = {
  cors: { origin: '*' },
  bodyParser: { json: { limit: '10mb' } },
  logger: { level: 'info' },
};
```

**Changes:**
- ❌ Boolean values no longer accepted
- ✅ Must provide configuration objects
- ✅ More granular control over middleware

**Impact:** 🟡 **MEDIUM** - Affects middleware configuration

**Migration:**
```typescript
// Before
const config = {
  cors: true,
  bodyParser: true,
};

// After
const config = {
  cors: {},  // Use defaults
  bodyParser: {},  // Use defaults
  // Or with custom options
  cors: { origin: '*', credentials: true },
  bodyParser: { json: { limit: '10mb' } },
};
```

---

### 4. TypeScript Required for Type Safety

**v1.x:**
- JavaScript-only
- No type definitions

**v2.0.0:**
- TypeScript-first
- Full type definitions included
- Optional: Can still use JavaScript

**Impact:** 🟢 **LOW** - Optional but recommended

**Migration:**
```bash
# Install TypeScript (if using)
npm install --save-dev typescript @types/node @types/express

# Create tsconfig.json
npx tsc --init
```

---

### 5. Request Validation with Zod

**v1.x:**
- Manual validation
- No built-in schema validation

**v2.0.0:**
```typescript
import { RequestValidator, z } from 'express-pack';

router.post('/users',
  RequestValidator.validateRequest({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email()
    })
  }),
  createUser
);
```

**Impact:** 🟢 **LOW** - New feature, not breaking

---

### 6. Peer Dependencies

**v1.x:**
- Express bundled as dependency

**v2.0.0:**
- Express as peer dependency
- Must install Express separately

**Impact:** 🟡 **MEDIUM** - Affects installation

**Migration:**
```bash
# Ensure Express is installed
npm install express@^4.0.0
```

---

### 7. File Extensions in Imports

**v1.x:**
```javascript
const helper = require('./utils/helper');
```

**v2.0.0:**
```typescript
import { helper } from './utils/helper.js';  // Note .js extension
```

**Impact:** 🟡 **MEDIUM** - Affects relative imports

---

## 📝 Step-by-Step Migration

### Prerequisites

Before starting, ensure you have:
- ✅ Node.js 16+ installed
- ✅ Git repository with committed changes
- ✅ Backup of your project
- ✅ Test suite to verify functionality

### Step 1: Backup Your Project

```bash
# Create a git branch for migration
git checkout -b migrate-to-v2

# Or create a backup
cp -r . ../my-project-backup
```

### Step 2: Update package.json

```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.0.0",
    "express-pack": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0",
    "@types/express": "^5.0.0"
  }
}
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Convert Imports to ESM

**Before:**
```javascript
const express = require('express');
const { ExpressPack } = require('express-pack');
```

**After:**
```typescript
import express from 'express';
import { ExpressPack } from 'express-pack';
```

### Step 5: Update File Extensions

Rename files if needed:
```bash
# If using TypeScript
mv app.js app.ts
mv routes/users.js routes/users.ts

# If staying with JavaScript, ensure .js extension in imports
```

### Step 6: Update ExpressPack Initialization

**Before:**
```javascript
const app = express();
ExpressPack.init(app, config);
```

**After:**
```typescript
const app = express();
await ExpressPack.init({ app, config });
```

### Step 7: Update Configuration

**Before:**
```javascript
const config = {
  cors: true,
  bodyParser: true,
};
```

**After:**
```typescript
const config = {
  cors: {},
  bodyParser: {},
};
```

### Step 8: Update Relative Imports

Add `.js` extension to all relative imports:

**Before:**
```javascript
import { helper } from './utils/helper';
```

**After:**
```typescript
import { helper } from './utils/helper.js';
```

### Step 9: Test Your Application

```bash
# Run tests
npm test

# Start development server
npm run dev

# Check for errors and warnings
```

### Step 10: Update Documentation

- Update your project's README
- Update API documentation
- Update deployment scripts
- Inform team members

---

## 🤖 Automated Migration Tool

We provide a migration script to automate common changes:

### Installation

```bash
# Download migration script
curl -o migrate.js https://raw.githubusercontent.com/muthu-kumar369/express-pack/main/scripts/migrate-v1-to-v2.js

# Or copy from this repository
cp node_modules/express-pack/scripts/migrate-v1-to-v2.js ./
```

### Usage

```bash
# Dry run (preview changes)
node migrate.js --dry-run

# Run migration
node migrate.js

# With backup
node migrate.js --backup
```

### What It Does Automatically

- ✅ Updates `package.json` (adds `"type": "module"`)
- ✅ Converts `require()` to `import`
- ✅ Updates `ExpressPack.init()` calls
- ✅ Adds `.js` extensions to relative imports
- ✅ Creates backup before changes

### What Requires Manual Intervention

- ⚠️ Configuration object updates
- ⚠️ Custom middleware changes
- ⚠️ Complex import patterns
- ⚠️ TypeScript configuration

---

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot use import statement outside a module"

**Cause:** Missing `"type": "module"` in package.json

**Solution:**
```json
{
  "type": "module"
}
```

---

### Issue 2: "Error [ERR_MODULE_NOT_FOUND]"

**Cause:** Missing `.js` extension in relative imports

**Solution:**
```typescript
// Before
import { helper } from './utils/helper';

// After
import { helper } from './utils/helper.js';
```

---

### Issue 3: "ExpressPack.init is not a function"

**Cause:** Incorrect import syntax

**Solution:**
```typescript
// Wrong
import ExpressPack from 'express-pack';

// Correct
import { ExpressPack } from 'express-pack';
```

---

### Issue 4: "await is only valid in async function"

**Cause:** Using `await` outside async function

**Solution:**
```typescript
// Wrap in async function
async function startServer() {
  await ExpressPack.init({ app, config });
  app.listen(3000);
}

startServer();

// Or use .then()
ExpressPack.init({ app, config }).then(() => {
  app.listen(3000);
});
```

---

### Issue 5: Configuration not working

**Cause:** Using boolean values instead of objects

**Solution:**
```typescript
// Before
const config = { cors: true };

// After
const config = { cors: {} };
```

---

### Issue 6: TypeScript errors

**Cause:** Missing type definitions

**Solution:**
```bash
npm install --save-dev @types/node @types/express
```

---

## ↩️ Rollback Instructions

If migration fails, you can rollback:

### Using Git

```bash
# Discard all changes
git checkout .

# Or switch back to previous branch
git checkout main
git branch -D migrate-to-v2
```

### Using Backup

```bash
# Restore from backup
rm -rf ./*
cp -r ../my-project-backup/* ./
npm install
```

### Downgrade Package

```bash
# Reinstall v1.x
npm install express-pack@^1.0.8
```

---

## 🆘 Getting Help

### Documentation

- 📚 [README](https://github.com/muthu-kumar369/express-pack#readme)
- 📖 [API Documentation](https://muthu-kumar369.github.io/express-pack/)
- 📝 [Examples](https://github.com/muthu-kumar369/express-pack/tree/main/examples)

### Support Channels

- 🐛 [GitHub Issues](https://github.com/muthu-kumar369/express-pack/issues)
- 💬 [Discussions](https://github.com/muthu-kumar369/express-pack/discussions)
- 📧 Email: support@express-pack.dev

### Reporting Migration Issues

When reporting issues, please include:
- v1.x version you're migrating from
- Node.js version
- Error messages
- Minimal reproduction code

---

## ✅ Migration Checklist

Use this checklist to track your progress:

- [ ] Created backup/git branch
- [ ] Updated package.json (`"type": "module"`)
- [ ] Installed v2.0.0 and dependencies
- [ ] Converted require() to import
- [ ] Updated ExpressPack.init() calls
- [ ] Updated configuration format
- [ ] Added .js extensions to imports
- [ ] Tested application
- [ ] Updated documentation
- [ ] Deployed to staging
- [ ] Deployed to production

---

## 🎉 Success!

Congratulations on migrating to express-pack v2.0.0! 

Enjoy the benefits of:
- ✨ Full TypeScript support
- ✨ Modern ESM modules
- ✨ Better type safety
- ✨ Improved documentation
- ✨ New features and utilities

**Need help?** Open an issue on [GitHub](https://github.com/muthu-kumar369/express-pack/issues)!
