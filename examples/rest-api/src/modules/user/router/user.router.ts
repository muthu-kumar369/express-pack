import { ExpressPack, RequestValidator, AuthMiddleware, AsyncRouteWrapper } from 'express-pack';
import { z } from 'zod';
import { UserController } from '../controller/user.controller';

const router = ExpressPack.getRouter();

// Validation schemas
const createUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['user', 'admin']).optional(),
});

const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
});

const userIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

// Public routes
router.post(
    '/',
    RequestValidator.validateRequest({ body: createUserSchema }),
    AsyncRouteWrapper.asyncHandler(UserController.create)
);

// Protected routes (require authentication)
router.get(
    '/',
    AuthMiddleware.authenticateUser({
        secret: process.env.JWT_SECRET!,
        headerKey: 'authorization',
        usingBearer: true,
    }),
    AsyncRouteWrapper.asyncHandler(UserController.getAll)
);

router.get(
    '/:id',
    AuthMiddleware.authenticateUser({
        secret: process.env.JWT_SECRET!,
        headerKey: 'authorization',
        usingBearer: true,
    }),
    RequestValidator.validateRequest({ params: userIdSchema }),
    AsyncRouteWrapper.asyncHandler(UserController.getById)
);

router.put(
    '/:id',
    AuthMiddleware.authenticateUser({
        secret: process.env.JWT_SECRET!,
        headerKey: 'authorization',
        usingBearer: true,
    }),
    RequestValidator.validateRequest({ params: userIdSchema, body: updateUserSchema }),
    AsyncRouteWrapper.asyncHandler(UserController.update)
);

router.delete(
    '/:id',
    AuthMiddleware.authenticateUser({
        secret: process.env.JWT_SECRET!,
        headerKey: 'authorization',
        usingBearer: true,
    }),
    AuthMiddleware.authorizeRole({ allowedRoles: ['admin'] }),
    RequestValidator.validateRequest({ params: userIdSchema }),
    AsyncRouteWrapper.asyncHandler(UserController.delete)
);

export default router;
