import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/tenant.model';

declare global {
    namespace Express {
        interface Request {
            tenant?: any;
        }
    }
}

export async function tenantMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Extract tenant ID from header
        const tenantId = req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                error: 'Tenant ID required in X-Tenant-ID header',
            });
        }

        // Fetch tenant
        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                error: 'Tenant not found',
            });
        }

        // Check if tenant is active
        if (!tenant.isActive) {
            return res.status(403).json({
                success: false,
                error: 'Tenant account is inactive',
            });
        }

        // Check subscription status
        if (tenant.subscription.status === 'suspended') {
            return res.status(403).json({
                success: false,
                error: 'Subscription suspended. Please contact support.',
            });
        }

        if (tenant.subscription.status === 'inactive') {
            return res.status(403).json({
                success: false,
                error: 'Subscription inactive. Please renew your subscription.',
            });
        }

        // Check if subscription expired
        if (tenant.subscription.expiresAt && tenant.subscription.expiresAt < new Date()) {
            return res.status(403).json({
                success: false,
                error: 'Subscription expired',
            });
        }

        // Inject tenant into request
        req.tenant = tenant;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to validate tenant',
        });
    }
}
