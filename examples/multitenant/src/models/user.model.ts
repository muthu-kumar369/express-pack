import mongoose from 'mongoose';
import { SoftDeletePlugin, TimestampPlugin } from 'express-pack';

const userSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Compound index for tenant isolation
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

userSchema.plugin(SoftDeletePlugin);
userSchema.plugin(TimestampPlugin);

// Remove password from JSON
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

export const User = mongoose.model('User', userSchema);
