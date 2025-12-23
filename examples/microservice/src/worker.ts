import { config } from 'dotenv';
import { QueueService } from './services/queue.service';
import { CronService } from './services/cron.service';
import { EmailService } from './services/email.service';

config();

async function startWorker() {
    try {
        console.log('🔧 Starting worker process...\n');

        // Initialize services
        await QueueService.init();
        EmailService.init();

        // Setup queue consumers
        await QueueService.setupConsumers();

        // Initialize cron jobs
        await CronService.init();

        console.log('\n🚀 Worker process ready and listening for jobs');
        console.log('📬 Consuming queues: email-queue, report-queue, cleanup-queue');
        console.log('⏰ Cron jobs: daily-cleanup, hourly-reports, weekly-backup, daily-digest\n');
    } catch (error) {
        console.error('❌ Failed to start worker:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down worker...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down worker...');
    process.exit(0);
});

startWorker();
