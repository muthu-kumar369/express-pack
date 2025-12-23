import { MiddlewareConfig } from 'express-pack';

export const appConfig: MiddlewareConfig = {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },
    bodyParser: {
        json: { limit: '10mb' },
        urlencoded: { extended: true, limit: '10mb' },
    },
    logger: {
        level: (process.env.LOG_LEVEL as any) || 'info',
    },
    security: {
        contentSecurityPolicy: false,
    },
    compression: {
        level: 6,
        threshold: 1024,
    },
    'express-rate-limit': {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    },
};
