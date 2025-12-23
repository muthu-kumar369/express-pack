# Express-Pack Microservice Example

Microservice architecture demonstrating RabbitMQ messaging, cron jobs, email notifications, and file uploads.

## Features

- ✅ **RabbitMQ Integration** - Message queue for async processing
- ✅ **Cron Jobs** - Scheduled tasks with CronManager
- ✅ **Email Service** - Email notifications via queue
- ✅ **File Upload** - S3-compatible file storage
- ✅ **Event-Driven** - Pub/sub messaging patterns
- ✅ **Worker Processes** - Background job processing
- ✅ **Retry Logic** - Automatic retry for failed jobs
- ✅ **Monitoring** - Metrics and health checks

## Architecture

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│   API    │─────▶│ RabbitMQ │─────▶│  Worker  │
│ Service  │      │  Queue   │      │ Service  │
└──────────┘      └──────────┘      └──────────┘
     │                                    │
     │                                    ▼
     │                            ┌──────────────┐
     │                            │ Email Service│
     │                            └──────────────┘
     │                                    │
     ▼                                    ▼
┌──────────┐                      ┌──────────┐
│ Database │                      │   SMTP   │
└──────────┘                      └──────────┘
```

## Key Implementation

### 1. RabbitMQ Setup

```typescript
// services/queue.service.ts
import { RabbitMQService } from 'express-pack';

export class QueueService {
  static async init() {
    await RabbitMQService.init({
      enabled: true,
      uri: process.env.RABBITMQ_URI!,
      exchanges: [
        { name: 'notifications', type: 'topic' },
        { name: 'tasks', type: 'direct' },
      ],
      queues: [
        { name: 'email-queue', options: { durable: true } },
        { name: 'sms-queue', options: { durable: true } },
        { name: 'report-queue', options: { durable: true } },
      ],
    });

    await this.setupConsumers();
  }

  static async setupConsumers() {
    // Email consumer
    await RabbitMQService.consume(
      'email-queue',
      async (message) => {
        await EmailService.send(message);
      },
      { retryAttempts: 3, retryDelay: 5000 }
    );

    // Report consumer
    await RabbitMQService.consume(
      'report-queue',
      async (message) => {
        await ReportService.generate(message);
      },
      { retryAttempts: 2 }
    );
  }

  static async publishEmail(data: any) {
    await RabbitMQService.publishToQueue('email-queue', data);
  }

  static async publishReport(data: any) {
    await RabbitMQService.publishToQueue('report-queue', data);
  }
}
```

### 2. Cron Jobs

```typescript
// services/cron.service.ts
import { CronManager } from 'express-pack';

export class CronService {
  static async init() {
    // Daily cleanup job
    CronManager.addJob({
      name: 'daily-cleanup',
      schedule: '0 0 * * *', // Every day at midnight
      handler: async () => {
        console.log('Running daily cleanup...');
        await this.cleanupOldRecords();
      },
    });

    // Hourly report generation
    CronManager.addJob({
      name: 'hourly-reports',
      schedule: '0 * * * *', // Every hour
      handler: async () => {
        console.log('Generating hourly reports...');
        await this.generateReports();
      },
    });

    // Weekly backup
    CronManager.addJob({
      name: 'weekly-backup',
      schedule: '0 0 * * 0', // Every Sunday at midnight
      handler: async () => {
        console.log('Running weekly backup...');
        await this.backupDatabase();
      },
    });

    CronManager.startAll();
  }

  static async cleanupOldRecords() {
    // Cleanup logic
  }

  static async generateReports() {
    // Report generation logic
  }

  static async backupDatabase() {
    // Backup logic
  }
}
```

### 3. Email Service

```typescript
// services/email.service.ts
export class EmailService {
  static async send(data: {
    to: string;
    subject: string;
    body: string;
    template?: string;
  }) {
    // Send email via SMTP or service like SendGrid
    console.log(`Sending email to ${data.to}`);
    
    // Implementation would use nodemailer or similar
    // This is a placeholder
    return { success: true, messageId: 'msg_123' };
  }

  static async sendWelcomeEmail(user: any) {
    await QueueService.publishEmail({
      to: user.email,
      subject: 'Welcome!',
      template: 'welcome',
      data: { name: user.name },
    });
  }

  static async sendPasswordReset(user: any, token: string) {
    await QueueService.publishEmail({
      to: user.email,
      subject: 'Password Reset',
      template: 'password-reset',
      data: { name: user.name, token },
    });
  }
}
```

### 4. File Upload Service

```typescript
// services/storage.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class StorageService {
  private static s3Client: S3Client;

  static init() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }

  static async uploadFile(file: Buffer, key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return {
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
      key,
    };
  }
}
```

### 5. Worker Process

```typescript
// worker.ts
import { QueueService } from './services/queue.service';
import { CronService } from './services/cron.service';

async function startWorker() {
  console.log('🔧 Starting worker process...');

  // Initialize queue consumers
  await QueueService.init();
  console.log('✅ Queue consumers started');

  // Initialize cron jobs
  await CronService.init();
  console.log('✅ Cron jobs started');

  console.log('🚀 Worker process ready');
}

startWorker();
```

## Usage

### 1. Start Services

```bash
# Start RabbitMQ
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management

# Start API server
npm run dev

# Start worker process
npm run worker
```

### 2. Send Email via Queue

```typescript
// In your controller
await QueueService.publishEmail({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'Welcome to our service!',
});
```

### 3. Schedule Task

```typescript
CronManager.addJob({
  name: 'custom-task',
  schedule: '*/5 * * * *', // Every 5 minutes
  handler: async () => {
    console.log('Running custom task');
  },
});
```

## Benefits

- ⚡ **Async Processing** - Don't block API requests
- 🔄 **Retry Logic** - Automatic retry for failures
- 📊 **Scalable** - Scale workers independently
- ⏰ **Scheduled Tasks** - Automate recurring jobs
- 🔍 **Monitoring** - Track queue and job metrics

## Running

```bash
# Install dependencies
npm install

# Start API server
npm run dev

# Start worker (in separate terminal)
npm run worker

# View RabbitMQ management UI
open http://localhost:15672
```

## Learn More

See the complete implementation in `examples/microservice/`

## License

MIT
