# Task 2: API Documentation with TypeDoc

## Context

express-pack currently lacks auto-generated API documentation. Developers must read source code to understand available types, interfaces, and methods. This creates a poor developer experience and slows adoption.

## Objective

Set up TypeDoc to auto-generate comprehensive API documentation from TypeScript source code, publish it to GitHub Pages, and integrate it into the development workflow.

---

## Requirements

### 1. TypeDoc Setup

**Install Dependencies:**
```bash
npm install --save-dev typedoc typedoc-plugin-markdown
```

**Create TypeDoc Configuration:**

File: `typedoc.json`
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "exclude": [
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/node_modules/**"
  ],
  "excludePrivate": true,
  "excludeProtected": false,
  "excludeInternal": true,
  "readme": "README.md",
  "name": "express-pack API Documentation",
  "includeVersion": true,
  "categorizeByGroup": true,
  "categoryOrder": [
    "Framework",
    "Authentication",
    "Middleware",
    "Services",
    "Plugins",
    "Utilities",
    "*"
  ],
  "sort": ["source-order"],
  "kindSortOrder": [
    "Class",
    "Interface",
    "TypeAlias",
    "Function",
    "Variable"
  ],
  "navigation": {
    "includeCategories": true,
    "includeGroups": true
  }
}
```

### 2. Add JSDoc Comments

**Current State:** Minimal JSDoc comments  
**Target State:** Comprehensive JSDoc for all public APIs

**Guidelines:**

1. **Classes:**
```typescript
/**
 * ExpressPack is the main entry point for initializing and configuring
 * an Express application with pre-configured middleware and utilities.
 * 
 * @example
 * ```typescript
 * import { ExpressPack } from 'express-pack';
 * import express from 'express';
 * 
 * const app = express();
 * await ExpressPack.init({ app, config: { cors: {}, bodyParser: {} } });
 * ```
 * 
 * @category Framework
 */
export class ExpressPack {
  // ...
}
```

2. **Methods:**
```typescript
/**
 * Initializes the Express application with provided middleware configuration.
 * 
 * @param options - Configuration options
 * @param options.app - Express application instance
 * @param options.config - Middleware configuration object
 * @returns Promise that resolves to the configured Express application
 * 
 * @throws {Error} If app is already initialized
 * 
 * @example
 * ```typescript
 * const app = express();
 * await ExpressPack.init({
 *   app,
 *   config: {
 *     cors: { origin: '*' },
 *     bodyParser: { json: { limit: '10mb' } }
 *   }
 * });
 * ```
 */
static async init({ app, config }: {
  app: Application;
  config?: MiddlewareConfig;
}): Promise<Application>
```

3. **Interfaces:**
```typescript
/**
 * Configuration options for Express middleware.
 * 
 * @category Configuration
 */
export interface MiddlewareConfig {
  /**
   * CORS configuration options
   * @see https://www.npmjs.com/package/cors
   */
  cors?: CorsOptions;
  
  /**
   * Body parser configuration
   */
  bodyParser?: BodyParserConfig;
  
  /**
   * Logger configuration (Winston)
   */
  logger?: LoggerConfig;
  
  /**
   * Security headers configuration (Helmet)
   */
  security?: HelmetOptions;
  
  /**
   * Response compression configuration
   */
  compression?: CompressionOptions;
  
  /**
   * Rate limiting configuration
   */
  'express-rate-limit'?: RateLimitOptions;
}
```

4. **Type Aliases:**
```typescript
/**
 * Supported authentication strategies
 * 
 * @category Authentication
 */
export type AuthStrategy = 'jwt' | 'google' | 'facebook' | 'github';

/**
 * API response format with type-safe data
 * 
 * @typeParam T - Type of the response data
 * 
 * @category Utilities
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  code: string;
  message?: string;
};
```

### 3. Organize with Categories

Use `@category` tags to organize documentation:

**Categories:**
- Framework (ExpressPack, core initialization)
- Authentication (JWT, Passport, middleware)
- Middleware (validators, tracers, session)
- Services (Redis, RabbitMQ, Cron, Email, Storage, Payment)
- Plugins (Mongoose plugins)
- Utilities (date, string, validation, response, encryption)
- Configuration (config types and interfaces)
- Types (shared type definitions)

### 4. Add Package Scripts

Update `package.json`:
```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch",
    "docs:serve": "npx http-server docs/api -p 8080",
    "docs:markdown": "typedoc --plugin typedoc-plugin-markdown"
  }
}
```

### 5. GitHub Pages Setup

**Create GitHub Actions Workflow:**

File: `.github/workflows/docs.yml`
```yaml
name: Generate and Deploy Docs

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run docs
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/api
  
  deploy:
    needs: build-docs
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Documentation Landing Page

Create `docs/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>express-pack Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    .hero {
      text-align: center;
      padding: 3rem 0;
    }
    .links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .card {
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>express-pack Documentation</h1>
    <p>Modular and scalable utility library for Express.js</p>
  </div>
  
  <div class="links">
    <a href="./api/index.html" class="card">
      <h3>📚 API Reference</h3>
      <p>Complete API documentation generated from source code</p>
    </a>
    
    <a href="https://github.com/muthu-kumar369/express-pack#readme" class="card">
      <h3>📖 Getting Started</h3>
      <p>Installation, quick start, and usage examples</p>
    </a>
    
    <a href="https://github.com/muthu-kumar369/express-pack/tree/main/examples" class="card">
      <h3>💡 Examples</h3>
      <p>Real-world example projects and code samples</p>
    </a>
    
    <a href="https://github.com/muthu-kumar369/express-pack" class="card">
      <h3>💻 GitHub</h3>
      <p>Source code, issues, and contributions</p>
    </a>
  </div>
</body>
</html>
```

### 7. Add Documentation Badge

Update README.md to include documentation badge:
```markdown
[![Documentation](https://img.shields.io/badge/docs-typedoc-blue)](https://muthu-kumar369.github.io/express-pack/)
```

---

## Implementation Steps

1. **Install TypeDoc**
   ```bash
   npm install --save-dev typedoc typedoc-plugin-markdown
   ```

2. **Create Configuration**
   - Create `typedoc.json`
   - Add scripts to `package.json`

3. **Add JSDoc Comments**
   - Start with core modules (framework, auth, middleware)
   - Add examples to all public APIs
   - Use `@category` tags for organization

4. **Generate Documentation**
   ```bash
   npm run docs
   ```

5. **Review Generated Docs**
   ```bash
   npm run docs:serve
   # Open http://localhost:8080
   ```

6. **Setup GitHub Pages**
   - Create `.github/workflows/docs.yml`
   - Enable GitHub Pages in repository settings
   - Set source to GitHub Actions

7. **Test Deployment**
   - Push to main branch
   - Verify workflow runs successfully
   - Check deployed documentation

---

## Priority Modules for Documentation

### High Priority (Week 1)
1. `framework/express/index.ts` - ExpressPack class
2. `auth/middleware/index.ts` - Authentication middleware
3. `middleware/request-validator/index.ts` - Validation
4. `service/cache/redis/index.ts` - Redis service
5. `util/response/index.ts` - Response utilities

### Medium Priority (Week 2)
6. `service/queue/index.ts` - RabbitMQ service
7. `service/scheduler/index.ts` - Cron manager
8. `service/message/index.ts` - Email services
9. `plugin/mongoose/index.ts` - Mongoose plugins
10. `util/date/index.ts` - Date utilities

### Low Priority (Week 3)
11. All remaining utilities
12. Configuration types
13. Third-party wrappers

---

## Verification

### Automated Checks

```bash
# Generate documentation
npm run docs

# Check for errors
# TypeDoc will report missing or invalid JSDoc

# Serve locally
npm run docs:serve
```

### Manual Review

- [ ] All public APIs have JSDoc comments
- [ ] All examples compile and work
- [ ] Categories are properly organized
- [ ] Navigation is intuitive
- [ ] Search works correctly
- [ ] GitHub Pages deployment successful
- [ ] Documentation badge in README works

---

## Success Metrics

- JSDoc coverage: 90%+ of public APIs
- Categories: 8 defined
- Examples: 50+ code examples
- GitHub Pages: Successfully deployed
- Build time: < 30 seconds

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** Medium
- **Risk:** Low

---

## Dependencies

- Task 1: README Enhancement (for linking)

---

## Follow-up Tasks

- Integrate API docs link in README
- Add "Edit on GitHub" links to docs
- Set up automated doc updates on releases
