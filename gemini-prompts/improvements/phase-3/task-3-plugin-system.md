# Task 3: Plugin System Architecture

## Context

express-pack needs an extensible plugin system to allow developers to add custom functionality without modifying core code.

## Objective

Create a robust plugin architecture that allows third-party plugins to extend express-pack functionality with hooks, middleware injection, and lifecycle management.

---

## Requirements

### 1. Plugin API Design

**Plugin Interface:**
```typescript
export interface Plugin {
  name: string;
  version: string;
  install(app: Application, options?: any): void | Promise<void>;
  uninstall?(): void | Promise<void>;
}

export interface PluginHooks {
  beforeInit?: (app: Application) => void | Promise<void>;
  afterInit?: (app: Application) => void | Promise<void>;
  beforeRequest?: (req: Request, res: Response, next: NextFunction) => void;
  afterResponse?: (req: Request, res: Response) => void;
  onError?: (error: Error, req: Request, res: Response) => void;
}
```

### 2. Plugin Manager

**packages/core/src/plugin/manager.ts:**
```typescript
import { Application } from 'express';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: PluginHooks[] = [];

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }
    this.plugins.set(plugin.name, plugin);
    return this;
  }

  async install(app: Application, pluginName: string, options?: any) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }
    await plugin.install(app, options);
  }

  async installAll(app: Application) {
    for (const [name, plugin] of this.plugins) {
      await plugin.install(app);
    }
  }

  async uninstall(pluginName: string) {
    const plugin = this.plugins.get(pluginName);
    if (plugin?.uninstall) {
      await plugin.uninstall();
    }
    this.plugins.delete(pluginName);
  }

  addHooks(hooks: PluginHooks) {
    this.hooks.push(hooks);
  }

  async executeHook(hookName: keyof PluginHooks, ...args: any[]) {
    for (const hooks of this.hooks) {
      const hook = hooks[hookName];
      if (hook) {
        await (hook as any)(...args);
      }
    }
  }
}
```

### 3. Built-in Plugins

**1. Request Logging Plugin:**
```typescript
export const RequestLoggingPlugin: Plugin = {
  name: 'request-logging',
  version: '1.0.0',
  install(app, options = {}) {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
      });
      next();
    });
  },
};
```

**2. Request ID Plugin:**
```typescript
export const RequestIDPlugin: Plugin = {
  name: 'request-id',
  version: '1.0.0',
  install(app) {
    app.use((req, res, next) => {
      req.id = req.headers['x-request-id'] || crypto.randomUUID();
      res.setHeader('X-Request-ID', req.id);
      next();
    });
  },
};
```

**3. Response Time Plugin:**
```typescript
export const ResponseTimePlugin: Plugin = {
  name: 'response-time',
  version: '1.0.0',
  install(app) {
    app.use((req, res, next) => {
      const start = process.hrtime();
      res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const ms = seconds * 1000 + nanoseconds / 1000000;
        res.setHeader('X-Response-Time', `${ms.toFixed(2)}ms`);
      });
      next();
    });
  },
};
```

**4. Health Check Plugin:**
```typescript
export const HealthCheckPlugin: Plugin = {
  name: 'health-check',
  version: '1.0.0',
  install(app, options = { path: '/health' }) {
    app.get(options.path, (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  },
};
```

**5. CORS Plugin:**
```typescript
export const CORSPlugin: Plugin = {
  name: 'cors',
  version: '1.0.0',
  install(app, options = {}) {
    app.use(cors(options));
  },
};
```

### 4. Integration with ExpressPack

**Update ExpressPack class:**
```typescript
export class ExpressPack {
  private static pluginManager = new PluginManager();

  static use(plugin: Plugin, options?: any) {
    this.pluginManager.register(plugin);
    if (this.#app) {
      this.pluginManager.install(this.#app, plugin.name, options);
    }
    return this;
  }

  static async init({ app, config, plugins = [] }: {
    app: Application;
    config?: MiddlewareConfig;
    plugins?: Array<{ plugin: Plugin; options?: any }>;
  }) {
    // ... existing init code

    // Install plugins
    for (const { plugin, options } of plugins) {
      await this.pluginManager.install(app, plugin.name, options);
    }

    return app;
  }
}
```

### 5. Usage Example

```typescript
import { ExpressPack } from '@express-pack/core';
import {
  RequestLoggingPlugin,
  RequestIDPlugin,
  ResponseTimePlugin,
  HealthCheckPlugin,
} from '@express-pack/plugins';

const app = express();

await ExpressPack.init({
  app,
  config: {},
  plugins: [
    { plugin: RequestIDPlugin },
    { plugin: RequestLoggingPlugin },
    { plugin: ResponseTimePlugin },
    { plugin: HealthCheckPlugin, options: { path: '/api/health' } },
  ],
});
```

### 6. Custom Plugin Example

```typescript
const MyCustomPlugin: Plugin = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  async install(app, options) {
    // Add custom middleware
    app.use((req, res, next) => {
      req.customData = { foo: 'bar' };
      next();
    });

    // Add custom route
    app.get('/custom', (req, res) => {
      res.json({ message: 'Custom plugin route' });
    });
  },
  async uninstall() {
    // Cleanup if needed
  },
};

ExpressPack.use(MyCustomPlugin);
```

---

## Implementation Steps

1. **Design Plugin API**
   - Define Plugin interface
   - Define PluginHooks interface

2. **Implement Plugin Manager**
   - Plugin registration
   - Plugin installation
   - Hook execution

3. **Create Built-in Plugins**
   - Request logging
   - Request ID
   - Response time
   - Health check
   - CORS

4. **Integrate with ExpressPack**
   - Add plugin support to init
   - Add use() method

5. **Document Plugin API**
   - Plugin development guide
   - Hook documentation
   - Examples

6. **Create Plugin Template**
   - CLI command to generate plugin
   - Template files

---

## Verification

```bash
# Test plugin system
npm test

# Test built-in plugins
npm run test:plugins

# Create custom plugin
npx @express-pack/cli generate plugin my-plugin
```

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** Medium-High
- **Risk:** Medium
