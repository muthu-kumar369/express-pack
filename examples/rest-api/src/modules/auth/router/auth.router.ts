import { ExpressPack, AsyncRouteWrapper } from '@express-pack/core';
import { RequestValidator } from '@express-pack/validation';
import { z } from 'zod';
import { AuthController } from '../controller/auth.controller';

const router = ExpressPack.getRouter();

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});

// Routes
router.post(
    '/register',
    RequestValidator.validateRequest({ body: registerSchema }),
    AsyncRouteWrapper.asyncHandler(AuthController.register)
);

router.post(
    '/login',
    RequestValidator.validateRequest({ body: loginSchema }),
    AsyncRouteWrapper.asyncHandler(AuthController.login)
);

router.post(
    '/refresh',
    RequestValidator.validateRequest({ body: refreshSchema }),
    AsyncRouteWrapper.asyncHandler(AuthController.refresh)
);

export default router;
