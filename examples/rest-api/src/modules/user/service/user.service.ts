import { User } from '../model/user.model';
import { EncryptionUtil, RedisClientService } from 'express-pack';

export class UserService {
    /**
     * Create a new user
     */
    static async create(data: { name: string; email: string; password: string; role?: string }) {
        // Hash password
        const hashedPassword = await EncryptionUtil.hash(data.password);

        // Create user
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        return user;
    }

    /**
     * Find user by ID with caching
     */
    static async findById(id: string) {
        const cacheKey = `user:${id}`;

        // Try cache first
        const cached = await RedisClientService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // Fetch from database
        const user = await User.findById(id);

        // Cache for 1 hour
        if (user) {
            await RedisClientService.set(cacheKey, JSON.stringify(user), { expire: 3600 });
        }

        return user;
    }

    /**
     * Find all users
     */
    static async findAll() {
        return await User.find({ isDeleted: false });
    }

    /**
     * Find user by email
     */
    static async findByEmail(email: string) {
        return await User.findOne({ email, isDeleted: false });
    }

    /**
     * Update user
     */
    static async update(id: string, data: Partial<{ name: string; email: string; role: string }>) {
        const user = await User.findByIdAndUpdate(id, data, { new: true });

        // Invalidate cache
        await RedisClientService.del(`user:${id}`);

        return user;
    }

    /**
     * Delete user (soft delete)
     */
    static async delete(id: string) {
        const user = await User.findById(id);
        if (!user) return null;

        // Soft delete
        await (user as any).softDelete();

        // Invalidate cache
        await RedisClientService.del(`user:${id}`);

        return user;
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword: string, hashedPassword: string) {
        return await EncryptionUtil.compare(plainPassword, hashedPassword);
    }
}
