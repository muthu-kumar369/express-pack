import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/tenant.model';

export async function usageTrackingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const tenant = req.tenant;

    if (!tenant) {
        return next();
    }

    try {
        // Increment API call count
        await Tenant.findByIdAndUpdate(tenant._id, {
            $inc: { 'usage.apiCalls': 1 },
        });

        // Check if limit exceeded
        if (tenant.usage.apiCalls >= tenant.limits.apiCalls) {
            return res.status(429).json({
                success: false,
                error: 'API call limit exceeded for this billing period',
                limit: tenant.limits.apiCalls,
                usage: tenant.usage.apiCalls,
            });
        }

        next();
    } catch (error) {
        // Don't block request if tracking fails
        next();
    }
}
