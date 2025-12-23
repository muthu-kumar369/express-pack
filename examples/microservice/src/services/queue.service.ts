import { RabbitMQService } from 'express-pack';
import { EmailService } from './email.service';

export class QueueService {
    /**
     * Initialize RabbitMQ with exchanges and queues
     */
    static async init() {
        await RabbitMQService.init({
            enabled: true,
            uri: process.env.RABBITMQ_URI || 'amqp://localhost',
            exchanges: [
                { name: 'notifications', type: 'topic' },
                { name: 'tasks', type: 'direct' },
            ],
            queues: [
                { name: 'email-queue', options: { durable: true } },
                { name: 'sms-queue', options: { durable: true } },
                { name: 'report-queue', options: { durable: true } },
                { name: 'cleanup-queue', options: { durable: true } },
            ],
        });

        console.log('✅ RabbitMQ initialized');
    }

    /**
     * Setup consumers for all queues
     */
    static async setupConsumers() {
        // Email queue consumer
        await RabbitMQService.consume(
            'email-queue',
            async (message: any) => {
                console.log('📧 Processing email:', message.to);
                await EmailService.send(message);
            },
            {
                retryAttempts: 3,
                retryDelay: 5000,
            }
        );

        // Report queue consumer
        await RabbitMQService.consume(
            'report-queue',
            async (message: any) => {
                console.log('📊 Generating report:', message.type);
                // Report generation logic here
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log('✅ Report generated');
            },
            {
                retryAttempts: 2,
            }
        );

        // Cleanup queue consumer
        await RabbitMQService.consume(
            'cleanup-queue',
            async (message: any) => {
                console.log('🧹 Running cleanup:', message.task);
                // Cleanup logic here
            }
        );

        console.log('✅ Queue consumers started');
    }

    /**
     * Publish email to queue
     */
    static async publishEmail(data: {
        to: string;
        subject: string;
        body: string;
        template?: string;
    }) {
        await RabbitMQService.publishToQueue('email-queue', data);
    }

    /**
     * Publish report generation task
     */
    static async publishReport(data: { type: string; userId: string; params: any }) {
        await RabbitMQService.publishToQueue('report-queue', data);
    }

    /**
     * Publish cleanup task
     */
    static async publishCleanup(data: { task: string; params: any }) {
        await RabbitMQService.publishToQueue('cleanup-queue', data);
    }
}
