import express from 'express';
import mongoose from 'mongoose';
import { ExpressPack, RedisClientService } from 'express-pack';
import { config } from 'dotenv';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { usageTrackingMiddleware } from './middleware/usage-tracking.middleware';

config();

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL!);
        console.log('✅ Connected to MongoDB');

        // Initialize Redis
        await RedisClientService.init({
            enabled: true,
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        });
        console.log('✅ Connected to Redis');

        // Initialize ExpressPack
        await ExpressPack.init({
            app,
            config: {
                cors: { origin: '*', credentials: true },
                bodyParser: { json: { limit: '10mb' } },
            },
        });
        console.log('✅ ExpressPack initialized');

        // Apply tenant middleware globally
        app.use('/api', tenantMiddleware);
        app.use('/api', usageTrackingMiddleware);

        // Health check
        app.get('/health', (req, res) => {
            res.json({ status: 'healthy', service: 'multitenant-api' });
        });

        // Example route
        app.get('/api/v1/users', async (req, res) => {
            res.json({
                success: true,
                tenant: {
                    id: req.tenant._id,
                    name: req.tenant.name,
                    plan: req.tenant.subscription.plan,
                },
                message: 'Multi-tenant API working!',
            });
        });

        app.listen(PORT, () => {
            console.log(`\n🚀 Multi-Tenant Server running on http://localhost:${PORT}`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
