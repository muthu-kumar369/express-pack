import { RouteGroup } from 'express-pack';
import userRouter from '../modules/user/router/user.router';
import authRouter from '../modules/auth/router/auth.router';

export const routeConfig: { routes: RouteGroup[] } = {
    routes: [
        {
            prefix: '/api',
            version: '/v1',
            route: [
                { path: '/users', route: userRouter },
                { path: '/auth', route: authRouter },
            ],
        },
    ],
};
