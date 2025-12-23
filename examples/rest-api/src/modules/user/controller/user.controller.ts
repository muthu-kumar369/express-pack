import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { ResponseUtil } from 'express-pack';

export class UserController {
    /**
     * Create new user
     */
    static async create(req: Request, res: Response) {
        const { name, email, password, role } = req.body;

        // Check if email exists
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
            return ResponseUtil.send(req, res, 'EMAIL_EXISTS', null, 400);
        }

        // Create user
        const user = await UserService.create({ name, email, password, role });

        return ResponseUtil.send(req, res, 'USER_CREATED', { user }, 201);
    }

    /**
     * Get all users
     */
    static async getAll(req: Request, res: Response) {
        const users = await UserService.findAll();
        return ResponseUtil.send(req, res, 'SUCCESS', { users });
    }

    /**
     * Get user by ID
     */
    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const user = await UserService.findById(id);

        if (!user) {
            return ResponseUtil.send(req, res, 'USER_NOT_FOUND', null, 404);
        }

        return ResponseUtil.send(req, res, 'SUCCESS', { user });
    }

    /**
     * Update user
     */
    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const updates = req.body;

        const user = await UserService.update(id, updates);

        if (!user) {
            return ResponseUtil.send(req, res, 'USER_NOT_FOUND', null, 404);
        }

        return ResponseUtil.send(req, res, 'USER_UPDATED', { user });
    }

    /**
     * Delete user
     */
    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const user = await UserService.delete(id);

        if (!user) {
            return ResponseUtil.send(req, res, 'USER_NOT_FOUND', null, 404);
        }

        return ResponseUtil.send(req, res, 'USER_DELETED', null, 204);
    }
}
