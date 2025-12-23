import { Request, Response } from 'express';
import { UserService } from '../../user/service/user.service';
import { JWTUtil, ResponseUtil } from 'express-pack';

export class AuthController {
    /**
     * Register new user
     */
    static async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        // Check if email exists
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
            return ResponseUtil.send(req, res, 'EMAIL_EXISTS', null, 400);
        }

        // Create user
        const user = await UserService.create({ name, email, password });

        // Generate tokens
        const accessToken = JWTUtil.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const refreshToken = JWTUtil.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        return ResponseUtil.send(req, res, 'USER_CREATED', {
            user,
            accessToken,
            refreshToken,
        }, 201);
    }

    /**
     * Login user
     */
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // Find user
        const user = await UserService.findByEmail(email);
        if (!user) {
            return ResponseUtil.send(req, res, 'INVALID_CREDENTIALS', null, 401);
        }

        // Verify password
        const isValid = await UserService.verifyPassword(password, user.password);
        if (!isValid) {
            return ResponseUtil.send(req, res, 'INVALID_CREDENTIALS', null, 401);
        }

        // Generate tokens
        const accessToken = JWTUtil.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const refreshToken = JWTUtil.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        return ResponseUtil.send(req, res, 'LOGIN_SUCCESS', {
            user,
            accessToken,
            refreshToken,
        });
    }

    /**
     * Refresh access token
     */
    static async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;

        try {
            // Verify refresh token
            const decoded = JWTUtil.verify(refreshToken, process.env.REFRESH_SECRET!);

            // Generate new access token
            const user = await UserService.findById((decoded as any).userId);
            if (!user) {
                return ResponseUtil.send(req, res, 'USER_NOT_FOUND', null, 404);
            }

            const accessToken = JWTUtil.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            return ResponseUtil.send(req, res, 'SUCCESS', { accessToken });
        } catch (error) {
            return ResponseUtil.send(req, res, 'TOKEN_EXPIRED', null, 401);
        }
    }
}
