# Task 3: Migration Guide (v1 → v2)

## Context

express-pack v2.0.0 represents a major version bump, which typically indicates breaking changes. However, there is currently no migration guide to help users upgrade from v1.x to v2.0.0. This creates friction for existing users and may prevent adoption of the new version.

## Objective

Create a comprehensive migration guide that documents all breaking changes, provides step-by-step upgrade instructions, and includes automated migration tools where possible.

---

## Requirements

### 1. Document Breaking Changes

**Research Required:**
- Compare v1.x and v2.0.0 codebases
- Identify API changes
- Identify configuration changes
- Identify dependency changes
- Identify behavior changes

**Format:**

```markdown
## Breaking Changes

### 1. ExpressPack Initialization

**v1.x:**
```javascript
const { ExpressPack } = require('express-pack');
ExpressPack.init(app, config);
```

**v2.0.0:**
```typescript
import { ExpressPack } from 'express-pack';
await ExpressPack.init({ app, config });
```

**Changes:**
- Now returns a Promise (async/await required)
- Parameters wrapped in object for better extensibility
- ESM import instead of CommonJS require

**Migration:**
```typescript
// Before
ExpressPack.init(app, config);

// After
await ExpressPack.init({ app, config });
```

### 2. [Next Breaking Change]
...
```

### 2. Create Step-by-Step Migration Guide

**Structure:**

```markdown
# Migration Guide: v1.x → v2.0.0

## Prerequisites

- Node.js 16+ (v2 requires Node 16+, v1 supported Node 14+)
- TypeScript 5.0+ (if using TypeScript)
- Review breaking changes below

## Step 1: Update Dependencies

```bash
# Update express-pack
npm install express-pack@^2.0.0

# Update peer dependencies
npm install express@^4.0.0

# Update TypeScript (if using)
npm install --save-dev typescript@^5.0.0
```

## Step 2: Update Imports

**If using CommonJS (v1):**
```javascript
const { ExpressPack } = require('express-pack');
```

**Migrate to ESM (v2):**
```typescript
import { ExpressPack } from 'express-pack';
```

**Or use dynamic import:**
```javascript
const { ExpressPack } = await import('express-pack');
```

## Step 3: Update Initialization

**v1.x:**
```javascript
ExpressPack.init(app, config);
```

**v2.0.0:**
```typescript
await ExpressPack.init({ app, config });
```

## Step 4: Update Configuration

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

## Step 5: Update Route Configuration

[Specific changes to route configuration]

## Step 6: Update Middleware Usage

[Specific changes to middleware]

## Step 7: Update Service Integrations

[Changes to Redis, RabbitMQ, Cron, etc.]

## Step 8: Test Your Application

```bash
# Run tests
npm test

# Start dev server
npm run dev

# Check for deprecation warnings
```

## Step 9: Update Documentation

- Update your project's README
- Update API documentation
- Update deployment scripts

## Step 10: Deploy

- Test in staging environment
- Monitor for errors
- Gradually roll out to production
```

### 3. Create Automated Migration Tool

**CLI Tool for Automated Migration:**

File: `scripts/migrate-v1-to-v2.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 express-pack v1 → v2 Migration Tool\n');

// 1. Check current version
console.log('📦 Checking current version...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.dependencies['express-pack'];
console.log(`   Current version: ${currentVersion}`);

// 2. Backup files
console.log('\n💾 Creating backup...');
execSync('git stash push -m "express-pack-migration-backup"');
console.log('   ✓ Backup created (git stash)');

// 3. Update package.json
console.log('\n📝 Updating package.json...');
packageJson.dependencies['express-pack'] = '^2.0.0';
packageJson.type = 'module'; // Enable ESM
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('   ✓ package.json updated');

// 4. Install dependencies
console.log('\n📥 Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });
console.log('   ✓ Dependencies installed');

// 5. Transform code
console.log('\n🔄 Transforming code...');

// Find all files that import express-pack
const files = execSync('git grep -l "require.*express-pack"', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Transform require to import
  content = content.replace(
    /const\s+{\s*([^}]+)\s*}\s*=\s*require\(['"]express-pack['"]\)/g,
    'import { $1 } from "express-pack"'
  );
  
  // Transform ExpressPack.init
  content = content.replace(
    /ExpressPack\.init\(([^,]+),\s*([^)]+)\)/g,
    'await ExpressPack.init({ app: $1, config: $2 })'
  );
  
  fs.writeFileSync(file, content);
  console.log(`   ✓ Transformed ${file}`);
});

// 6. Summary
console.log('\n✅ Migration complete!');
console.log('\n📋 Next steps:');
console.log('   1. Review the changes: git diff');
console.log('   2. Test your application: npm test');
console.log('   3. Start dev server: npm run dev');
console.log('   4. If issues occur: git stash pop (restore backup)');
console.log('\n📖 Full migration guide: https://github.com/muthu-kumar369/express-pack/blob/main/MIGRATION.md');
```

### 4. Create Deprecation Warnings

**Add runtime warnings for deprecated APIs:**

```typescript
// In v2.0.0, add deprecation warnings
export class ExpressPack {
  /**
   * @deprecated Use init({ app, config }) instead
   */
  static initLegacy(app: Application, config?: MiddlewareConfig) {
    console.warn(
      '⚠️  ExpressPack.initLegacy() is deprecated. ' +
      'Use ExpressPack.init({ app, config }) instead. ' +
      'See migration guide: https://github.com/muthu-kumar369/express-pack/blob/main/MIGRATION.md'
    );
    return this.init({ app, config });
  }
}
```

### 5. Create Compatibility Layer (Optional)

**For gradual migration:**

```typescript
// @express-pack/compat
// Provides v1 API compatibility

export class ExpressPackCompat {
  static init(app: Application, config?: any) {
    // Convert v1 config to v2 format
    const v2Config = convertV1ConfigToV2(config);
    return ExpressPack.init({ app, config: v2Config });
  }
}

function convertV1ConfigToV2(v1Config: any): MiddlewareConfig {
  // Transform v1 config structure to v2
  return {
    cors: v1Config.cors === true ? {} : v1Config.cors,
    bodyParser: v1Config.bodyParser === true ? {} : v1Config.bodyParser,
    // ... more transformations
  };
}
```

---

## Implementation Steps

1. **Research Breaking Changes**
   - Clone v1.x branch
   - Compare with v2.0.0
   - Document all differences

2. **Write Migration Guide**
   - Create `MIGRATION.md`
   - Document each breaking change
   - Provide before/after examples
   - Add step-by-step instructions

3. **Create Migration Tool**
   - Write `scripts/migrate-v1-to-v2.js`
   - Test on sample projects
   - Add error handling

4. **Add Deprecation Warnings**
   - Identify deprecated APIs
   - Add console warnings
   - Link to migration guide

5. **Test Migration**
   - Create test project with v1
   - Run migration tool
   - Verify functionality

6. **Document Edge Cases**
   - Custom middleware
   - Custom plugins
   - Advanced configurations

---

## Migration Guide Structure

```markdown
# MIGRATION.md

## Table of Contents
1. [Overview](#overview)
2. [Breaking Changes](#breaking-changes)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Automated Migration](#automated-migration)
5. [Common Issues](#common-issues)
6. [Rollback Instructions](#rollback-instructions)
7. [Getting Help](#getting-help)

## Overview
- Why upgrade to v2?
- What's new in v2?
- Who should upgrade?
- Estimated migration time

## Breaking Changes
- Detailed list of all breaking changes
- Impact assessment for each change
- Migration path for each change

## Step-by-Step Guide
- Prerequisites
- 10-step migration process
- Verification steps

## Automated Migration
- Using the migration tool
- What it does automatically
- What requires manual intervention

## Common Issues
- Issue 1: ESM import errors
- Issue 2: Async initialization
- Issue 3: Configuration format
- [More issues]

## Rollback Instructions
- How to rollback if migration fails
- Backup strategies
- Recovery procedures

## Getting Help
- GitHub Issues
- Discord community
- Stack Overflow tag
```

---

## Verification

### Automated Tests

```bash
# Test migration tool
node scripts/migrate-v1-to-v2.js --dry-run

# Verify migrated project
npm test
npm run build
```

### Manual Testing

- [ ] Migration guide is clear and complete
- [ ] All breaking changes documented
- [ ] Migration tool works on test projects
- [ ] Deprecation warnings appear correctly
- [ ] Rollback instructions work
- [ ] Common issues section is helpful

---

## Success Metrics

- Migration guide completeness: 100% of breaking changes documented
- Migration tool success rate: 80%+ automated
- User feedback: Positive migration experience
- Support requests: Reduced migration-related issues

---

## Estimated Effort

- **Time:** 1 day
- **Complexity:** Medium
- **Risk:** Low (documentation only)

---

## Dependencies

- Access to v1.x codebase
- Test projects using v1.x

---

## Follow-up Tasks

- Monitor migration issues
- Update migration guide based on feedback
- Create video tutorial for migration
