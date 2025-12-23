# Task 2: WebSocket Support with Socket.io

## Context

express-pack needs real-time communication capabilities for features like chat, notifications, live updates, and collaborative editing.

## Objective

Create @express-pack/websocket package with Socket.io integration, room management, authentication, and seamless integration with Express.

---

## Requirements

### 1. Install Dependencies

```bash
cd packages/websocket
npm install socket.io
npm install --save-dev @types/socket.io
```

### 2. Package Structure

```
packages/websocket/
├── src/
│   ├── server/
│   │   ├── socket-server.ts    # Socket.io server
│   │   └── adapter.ts          # Redis adapter for clustering
│   ├── middleware/
│   │   ├── auth.ts             # Socket authentication
│   │   └── rate-limit.ts       # Rate limiting
│   ├── room/
│   │   ├── manager.ts          # Room management
│   │   └── types.ts            # Room types
│   ├── utils/
│   │   ├── event.ts            # Event utilities
│   │   └── error.ts            # Error handling
│   └── index.ts
└── package.json
```

### 3. Socket Server Setup

**packages/websocket/src/server/socket-server.ts:**
```typescript
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Application } from 'express';

export interface WebSocketConfig {
  cors?: {
    origin: string | string[];
    credentials?: boolean;
  };
  path?: string;
  adapter?: any;
  auth?: (socket: any) => Promise<boolean>;
}

export class WebSocketServer {
  private io: SocketServer;

  constructor(httpServer: HTTPServer, config: WebSocketConfig = {}) {
    this.io = new SocketServer(httpServer, {
      cors: config.cors || { origin: '*' },
      path: config.path || '/socket.io',
    });

    if (config.adapter) {
      this.io.adapter(config.adapter);
    }

    if (config.auth) {
      this.io.use(async (socket, next) => {
        try {
          const isAuthenticated = await config.auth!(socket);
          if (isAuthenticated) {
            next();
          } else {
            next(new Error('Authentication failed'));
          }
        } catch (error) {
          next(error as Error);
        }
      });
    }
  }

  on(event: string, handler: (socket: any) => void) {
    this.io.on(event, handler);
    return this;
  }

  emit(event: string, data: any) {
    this.io.emit(event, data);
    return this;
  }

  to(room: string) {
    return this.io.to(room);
  }

  getIO() {
    return this.io;
  }
}
```

### 4. Authentication Middleware

**packages/websocket/src/middleware/auth.ts:**
```typescript
import { JWTUtil } from '@express-pack/auth';

export function createAuthMiddleware(secret: string) {
  return async (socket: any) => {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decoded = await JWTUtil.verify(token, secret);
      socket.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  };
}
```

### 5. Room Management

**packages/websocket/src/room/manager.ts:**
```typescript
export class RoomManager {
  private io: any;

  constructor(io: any) {
    this.io = io;
  }

  async join(socketId: string, room: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      await socket.join(room);
      return true;
    }
    return false;
  }

  async leave(socketId: string, room: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      await socket.leave(room);
      return true;
    }
    return false;
  }

  async getRoomMembers(room: string): Promise<string[]> {
    const sockets = await this.io.in(room).fetchSockets();
    return sockets.map((s: any) => s.id);
  }

  async broadcast(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }

  async getRooms(): Promise<string[]> {
    return Array.from(this.io.sockets.adapter.rooms.keys());
  }
}
```

### 6. Integration with ExpressPack

**Usage Example:**
```typescript
import { ExpressPack } from '@express-pack/core';
import { WebSocketServer, createAuthMiddleware, RoomManager } from '@express-pack/websocket';
import express from 'express';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

await ExpressPack.init({ app, config: {} });

// Setup WebSocket server
const ws = new WebSocketServer(httpServer, {
  cors: { origin: '*', credentials: true },
  auth: createAuthMiddleware(process.env.JWT_SECRET!),
});

const roomManager = new RoomManager(ws.getIO());

// Handle connections
ws.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  console.log('User:', socket.user);

  // Join user-specific room
  socket.join(`user:${socket.user.id}`);

  // Handle custom events
  socket.on('join-room', async (roomId) => {
    await roomManager.join(socket.id, roomId);
    socket.emit('joined-room', { roomId });
  });

  socket.on('send-message', async (data) => {
    await roomManager.broadcast(data.roomId, 'new-message', {
      message: data.message,
      user: socket.user,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000);
```

### 7. Redis Adapter for Clustering

**packages/websocket/src/server/adapter.ts:**
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export async function createRedisAdapter(redisUrl: string) {
  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  return createAdapter(pubClient, subClient);
}

// Usage
const adapter = await createRedisAdapter('redis://localhost:6379');
const ws = new WebSocketServer(httpServer, { adapter });
```

### 8. Rate Limiting

**packages/websocket/src/middleware/rate-limit.ts:**
```typescript
export function createRateLimitMiddleware(options: {
  maxEvents: number;
  windowMs: number;
}) {
  const eventCounts = new Map<string, { count: number; resetAt: number }>();

  return (socket: any, next: any) => {
    socket.use((packet: any, next: any) => {
      const now = Date.now();
      const key = socket.id;
      const record = eventCounts.get(key);

      if (!record || now > record.resetAt) {
        eventCounts.set(key, {
          count: 1,
          resetAt: now + options.windowMs,
        });
        return next();
      }

      if (record.count >= options.maxEvents) {
        return next(new Error('Rate limit exceeded'));
      }

      record.count++;
      next();
    });

    next();
  };
}
```

---

## Implementation Steps

1. **Create Package**
   ```bash
   mkdir -p packages/websocket/src
   ```

2. **Install Dependencies**
   ```bash
   cd packages/websocket
   npm install socket.io @socket.io/redis-adapter
   ```

3. **Implement Core**
   - WebSocket server wrapper
   - Authentication middleware
   - Room management

4. **Add Features**
   - Redis adapter for clustering
   - Rate limiting
   - Event utilities

5. **Create Examples**
   - Basic WebSocket server
   - Chat application
   - Real-time notifications

6. **Write Tests**
   - Connection handling
   - Authentication
   - Room management

---

## Verification

```bash
# Build package
npm run build

# Test WebSocket server
npm test

# Test with client
node examples/websocket-client.js
```

---

## Estimated Effort

- **Time:** 2 days
- **Complexity:** Medium
- **Risk:** Medium
