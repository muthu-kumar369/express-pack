import express from 'express';
import mongoose from 'mongoose';
import { ExpressPack } from '@express-pack/core';
import { RedisClientService } from '@express-pack/cache';
import { config } from 'dotenv';
import { appConfig } from './config/app.config';
import { routeConfig } from './config/route.config';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL!);
        console.log('✅ Connected to MongoDB');

        // Initialize Redis (Updated for v2)
        RedisClientService.enableRedis(true, {
            REDIS_HOST: process.env.REDIS_HOST || 'localhost',
            REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
        });
        console.log('✅ Connected to Redis');

        // Initialize ExpressPack
        await ExpressPack.init({ app, config: appConfig });
        console.log('✅ ExpressPack initialized');

        // Initialize routes with OpenAPI
        ExpressPack.initRoutes({
            routes: routeConfig.routes,
            openapi: {
                enabled: true,
                output: './openapi.json',
                ui: '/api-docs',
                info: {
                    title: 'Express-Pack REST API Example',
                    version: '1.0.0',
                    description: 'Complete REST API example using express-pack with authentication, validation, and caching',
                },
                servers: [
                    { url: `http://localhost:${PORT}`, description: 'Development server' },
                ],
            },
        });
        console.log('✅ Routes initialized');

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await mongoose.connection.close();
    await RedisClientService.disconnect();
    process.exit(0);
});

startServer();
