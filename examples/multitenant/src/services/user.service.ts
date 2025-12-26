import { User } from '../models/user.model';
import { EncryptionUtil } from '@express-pack/utils';
import { RedisClientService } from '@express-pack/cache';

export class UserService {
    /**
     * Create user scoped to tenant
     */
    static async create(tenantId: string, data: { name: string; email: string; password: string; role?: string }) {
        const hashedPassword = await EncryptionUtil.hash(data.password);

        const user = await User.create({
            ...data,
            tenantId,
            password: hashedPassword,
        });

        return user;
    }

    /**
     * Find all users for a tenant
     */
    static async findAll(tenantId: string) {
        return await User.find({ tenantId, isDeleted: false });
    }

    /**
     * Find user by ID (tenant-scoped)
     */
    static async findById(tenantId: string, userId: string) {
        const cacheKey = `tenant:${tenantId}:user:${userId}`;

        // Try cache
        const cached = await RedisClientService.get(cacheKey);
        if (cached) return JSON.parse(cached);

        // Fetch from DB with tenant scope
        const user = await User.findOne({ _id: userId, tenantId, isDeleted: false });

        // Cache
        if (user) {
            await RedisClientService.set(cacheKey, JSON.stringify(user), { expire: 3600 });
        }

        return user;
    }

    /**
     * Find user by email (tenant-scoped)
     */
    static async findByEmail(tenantId: string, email: string) {
        return await User.findOne({ tenantId, email, isDeleted: false });
    }

    /**
     * Update user (tenant-scoped)
     */
    static async update(tenantId: string, userId: string, data: any) {
        const user = await User.findOneAndUpdate(
            { _id: userId, tenantId },
            data,
            { new: true }
        );

        // Invalidate cache
        await RedisClientService.del(`tenant:${tenantId}:user:${userId}`);

        return user;
    }

    /**
     * Delete user (tenant-scoped soft delete)
     */
    static async delete(tenantId: string, userId: string) {
        const user = await User.findOne({ _id: userId, tenantId });
        if (!user) return null;

        await (user as any).softDelete();
        await RedisClientService.del(`tenant:${tenantId}:user:${userId}`);

        return user;
    }
}
