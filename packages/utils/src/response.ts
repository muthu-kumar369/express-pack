import { Response } from 'express';

/**
 * Send success response
 */
export function sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

/**
 * Send error response
 */
export function sendError(res: Response, message: string, statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
}

/**
 * Send paginated response
 */
export function sendPaginated(
    res: Response,
    data: any[],
    page: number,
    limit: number,
    total: number
) {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}
