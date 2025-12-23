import express from 'express';
import mongoose from 'mongoose';
import { ExpressPack } from 'express-pack';
import { config } from 'dotenv';
import { QueueService } from './services/queue.service';
import { EmailService } from './services/email.service';

config();

const app = express();
const PORT = process.env.PORT || 3002;

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL!);
        console.log('✅ Connected to MongoDB');

        // Initialize ExpressPack
        await ExpressPack.init({
            app,
            config: {
                cors: { origin: '*' },
                bodyParser: { json: { limit: '10mb' } },
            },
        });
        console.log('✅ ExpressPack initialized');

        // Initialize services
        await QueueService.init();
        EmailService.init();

        // Health check
        app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                service: 'microservice-api',
                timestamp: new Date().toISOString(),
            });
        });

        // Example: Send email endpoint
        app.post('/api/v1/send-email', async (req, res) => {
            const { to, subject, body } = req.body;

            // Publish to queue instead of sending directly
            await QueueService.publishEmail({ to, subject, body });

            res.json({
                success: true,
                message: 'Email queued for sending',
            });
        });

        // Example: Generate report endpoint
        app.post('/api/v1/generate-report', async (req, res) => {
            const { type, userId, params } = req.body;

            await QueueService.publishReport({ type, userId, params });

            res.json({
                success: true,
                message: 'Report generation queued',
            });
        });

        app.listen(PORT, () => {
            console.log(`\n🚀 Microservice API running on http://localhost:${PORT}`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health`);
            console.log(`📧 Send Email: POST http://localhost:${PORT}/api/v1/send-email`);
            console.log(`\n⚠️  Start worker process with: npm run worker\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
