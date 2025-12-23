# Task 1: GraphQL Integration

## Context

express-pack currently only supports REST APIs. Many modern applications require GraphQL for flexible data querying and type-safe APIs.

## Objective

Create @express-pack/graphql package with Apollo Server integration, type-safe schema generation, and seamless integration with existing express-pack features.

---

## Requirements

### 1. Install Dependencies

```bash
cd packages/graphql
npm install @apollo/server graphql graphql-tag
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript
```

### 2. Package Structure

```
packages/graphql/
├── src/
│   ├── server/
│   │   ├── apollo.ts           # Apollo Server setup
│   │   └── context.ts          # GraphQL context
│   ├── schema/
│   │   ├── builder.ts          # Schema builder
│   │   └── directives.ts       # Custom directives
│   ├── middleware/
│   │   ├── auth.ts             # GraphQL auth middleware
│   │   └── validation.ts       # Input validation
│   ├── utils/
│   │   ├── resolver.ts         # Resolver utilities
│   │   └── error.ts            # Error handling
│   └── index.ts
├── codegen.yml                  # GraphQL Code Generator config
└── package.json
```

### 3. Apollo Server Setup

**packages/graphql/src/server/apollo.ts:**
```typescript
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Application } from 'express';
import { GraphQLSchema } from 'graphql';

export interface GraphQLConfig {
  schema: GraphQLSchema;
  context?: (req: any) => Promise<any>;
  plugins?: any[];
  introspection?: boolean;
  playground?: boolean;
}

export class GraphQLServer {
  private server: ApolloServer;

  constructor(config: GraphQLConfig) {
    this.server = new ApolloServer({
      schema: config.schema,
      plugins: config.plugins || [],
      introspection: config.introspection ?? true,
    });
  }

  async start() {
    await this.server.start();
  }

  middleware(contextFn?: (req: any) => Promise<any>) {
    return expressMiddleware(this.server, {
      context: contextFn || (async ({ req }) => ({ req })),
    });
  }

  async stop() {
    await this.server.stop();
  }
}
```

### 4. Schema Builder

**packages/graphql/src/schema/builder.ts:**
```typescript
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

export class SchemaBuilder {
  private queries: any = {};
  private mutations: any = {};
  private subscriptions: any = {};

  addQuery(name: string, config: any) {
    this.queries[name] = config;
    return this;
  }

  addMutation(name: string, config: any) {
    this.mutations[name] = config;
    return this;
  }

  addSubscription(name: string, config: any) {
    this.subscriptions[name] = config;
    return this;
  }

  build(): GraphQLSchema {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: this.queries,
      }),
      mutation: Object.keys(this.mutations).length > 0
        ? new GraphQLObjectType({
            name: 'Mutation',
            fields: this.mutations,
          })
        : undefined,
      subscription: Object.keys(this.subscriptions).length > 0
        ? new GraphQLObjectType({
            name: 'Subscription',
            fields: this.subscriptions,
          })
        : undefined,
    });
  }
}
```

### 5. Integration with ExpressPack

**Usage Example:**
```typescript
import { ExpressPack } from '@express-pack/core';
import { GraphQLServer, SchemaBuilder } from '@express-pack/graphql';
import express from 'express';

const app = express();
await ExpressPack.init({ app, config: {} });

// Build GraphQL schema
const schema = new SchemaBuilder()
  .addQuery('hello', {
    type: GraphQLString,
    resolve: () => 'Hello, World!',
  })
  .addQuery('user', {
    type: UserType,
    args: { id: { type: GraphQLString } },
    resolve: async (_, { id }, context) => {
      return await User.findById(id);
    },
  })
  .build();

// Setup GraphQL server
const graphql = new GraphQLServer({ schema });
await graphql.start();

app.use('/graphql', graphql.middleware(async ({ req }) => ({
  req,
  user: req.user, // From auth middleware
})));
```

### 6. Type Generation

**codegen.yml:**
```yaml
schema: './src/schema/**/*.graphql'
generates:
  ./src/generated/types.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      contextType: './context#GraphQLContext'
      mappers:
        User: '@/models/User#UserDocument'
```

### 7. Authentication Middleware

**packages/graphql/src/middleware/auth.ts:**
```typescript
import { GraphQLError } from 'graphql';

export function requireAuth(resolver: any) {
  return async (parent: any, args: any, context: any, info: any) => {
    if (!context.user) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
    return resolver(parent, args, context, info);
  };
}

export function requireRole(role: string) {
  return function (resolver: any) {
    return async (parent: any, args: any, context: any, info: any) => {
      if (!context.user || context.user.role !== role) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }
      return resolver(parent, args, context, info);
    };
  };
}
```

---

## Implementation Steps

1. **Create Package**
   ```bash
   mkdir -p packages/graphql/src
   ```

2. **Install Dependencies**
   ```bash
   cd packages/graphql
   npm install @apollo/server graphql
   ```

3. **Implement Core**
   - Apollo Server wrapper
   - Schema builder
   - Context setup

4. **Add Middleware**
   - Authentication
   - Validation
   - Error handling

5. **Setup Type Generation**
   - Configure GraphQL Code Generator
   - Generate types

6. **Create Examples**
   - Basic GraphQL server
   - With authentication
   - With database integration

7. **Write Tests**
   - Server initialization
   - Resolver execution
   - Authentication

---

## Verification

```bash
# Build package
npm run build

# Test GraphQL server
npm test

# Generate types
npm run codegen
```

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** High
- **Risk:** Medium
