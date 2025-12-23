# Task 1: Monorepo Setup with Lerna/Nx

## Context

express-pack is currently a single package with all features bundled together. This creates several issues:
- Large bundle size (users install everything even if they only need auth)
- Difficult to version features independently
- Harder to maintain and test
- No tree-shaking benefits

## Objective

Set up a monorepo structure using Lerna or Nx to enable package splitting, independent versioning, and better code organization.

---

## Requirements

### 1. Choose Monorepo Tool

**Option A: Lerna (Recommended for simplicity)**
- Simpler setup
- Good for npm package publishing
- Established ecosystem

**Option B: Nx (Recommended for advanced features)**
- Better build caching
- Advanced dependency graph
- Better for large teams

**Recommendation:** Start with **Lerna** for simplicity, can migrate to Nx later if needed.

---

### 2. Install Lerna

```bash
# Initialize Lerna
npx lerna init

# Install Lerna as dev dependency
npm install --save-dev lerna
```

### 3. Create Monorepo Structure

```
express-pack/
├── packages/
│   ├── core/                    # @express-pack/core
│   ├── auth/                    # @express-pack/auth
│   ├── cache/                   # @express-pack/cache
│   ├── queue/                   # @express-pack/queue
│   ├── scheduler/               # @express-pack/scheduler
│   ├── email/                   # @express-pack/email
│   ├── storage/                 # @express-pack/storage
│   ├── payment/                 # @express-pack/payment
│   ├── db/                      # @express-pack/db
│   ├── testing/                 # @express-pack/testing
│   ├── cli/                     # @express-pack/cli
│   └── express-pack/            # Main package (facade)
├── examples/
│   ├── rest-api/
│   ├── multitenant/
│   └── microservice/
├── docs/
├── lerna.json
├── package.json
├── tsconfig.base.json
└── README.md
```

### 4. Configure Lerna

**lerna.json:**
```json
{
  "version": "independent",
  "npmClient": "npm",
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish",
      "registry": "https://registry.npmjs.org/"
    },
    "version": {
      "allowBranch": "main",
      "conventionalCommits": true,
      "message": "chore(release): version packages"
    }
  },
  "packages": [
    "packages/*"
  ],
  "useWorkspaces": true
}
```

**Root package.json:**
```json
{
  "name": "express-pack-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "examples/*"
  ],
  "scripts": {
    "build": "lerna run build",
    "test": "lerna run test",
    "clean": "lerna clean",
    "bootstrap": "lerna bootstrap",
    "publish": "lerna publish",
    "version": "lerna version",
    "changed": "lerna changed",
    "diff": "lerna diff"
  },
  "devDependencies": {
    "lerna": "^8.0.0",
    "typescript": "^5.8.3",
    "tsup": "^8.5.0",
    "vitest": "^1.0.0"
  }
}
```

### 5. Create Shared TypeScript Config

**tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

### 6. Create Package Template

**packages/core/package.json:**
```json
{
  "name": "@express-pack/core",
  "version": "2.0.0",
  "description": "Core utilities for express-pack",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    "require": "./dist/index.cjs",
    "import": "./dist/index.mjs",
    "types": "./dist/index.d.ts"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run",
    "test:watch": "vitest watch"
  },
  "keywords": ["express", "middleware", "typescript"],
  "author": "Muthu Kumar",
  "license": "ISC",
  "peerDependencies": {
    "express": "^4.0.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.2",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3",
    "vitest": "^1.0.0"
  }
}
```

**packages/core/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": []
}
```

**packages/core/tsup.config.ts:**
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ['express'],
});
```

### 7. Setup Workspace Dependencies

**Using workspace protocol:**
```json
{
  "dependencies": {
    "@express-pack/core": "workspace:*",
    "@express-pack/auth": "workspace:*"
  }
}
```

### 8. Configure CI/CD for Monorepo

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Bootstrap packages
        run: npm run bootstrap
      
      - name: Build all packages
        run: npm run build
      
      - name: Test all packages
        run: npm run test
      
      - name: Check for changed packages
        run: npm run changed
```

**.github/workflows/publish.yml:**
```yaml
name: Publish Packages

on:
  push:
    branches: [main]
    paths:
      - 'packages/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run bootstrap
      - run: npm run build
      - run: npm run test
      
      - name: Configure Git
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
      
      - name: Publish packages
        run: npm run publish -- --yes
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 9. Add Turborepo for Build Caching (Optional)

```bash
npm install --save-dev turbo
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

---

## Implementation Steps

1. **Backup Current Code**
   ```bash
   git checkout -b monorepo-migration
   git commit -am "Backup before monorepo migration"
   ```

2. **Initialize Lerna**
   ```bash
   npx lerna init
   ```

3. **Create Folder Structure**
   ```bash
   mkdir -p packages/{core,auth,cache,queue,scheduler,email,storage,payment,db,testing,cli,express-pack}
   ```

4. **Setup Root Configuration**
   - Create root package.json with workspaces
   - Create lerna.json
   - Create tsconfig.base.json

5. **Create Package Templates**
   - For each package, create package.json, tsconfig.json, tsup.config.ts
   - Create src/index.ts placeholder

6. **Bootstrap Workspace**
   ```bash
   npm run bootstrap
   ```

7. **Test Build**
   ```bash
   npm run build
   ```

8. **Setup CI/CD**
   - Create GitHub Actions workflows
   - Test CI pipeline

---

## Verification

### Automated Tests

```bash
# Bootstrap packages
npm run bootstrap

# Build all packages
npm run build

# Test all packages
npm run test

# Check changed packages
npm run changed
```

### Manual Verification

- [ ] Lerna initialized successfully
- [ ] All packages have correct structure
- [ ] Workspace dependencies resolve correctly
- [ ] Build produces correct output
- [ ] CI/CD pipeline passes
- [ ] Can publish to npm (dry run)

---

## Success Metrics

- Monorepo structure: Created
- Lerna configuration: Working
- Package templates: Created
- CI/CD pipeline: Passing
- Build time: < 2 minutes
- All tests: Passing

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** High
- **Risk:** Medium

---

## Dependencies

- Phase 1 completion (tests needed for verification)

---

## Follow-up Tasks

- Task 2: Package Splitting (move code into packages)
- Task 6: Build Optimization
