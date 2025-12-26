import mongoose from 'mongoose';
import { SoftDeletePlugin, TimestampPlugin } from '@express-pack/db';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Add plugins
userSchema.plugin(SoftDeletePlugin);
userSchema.plugin(TimestampPlugin);

// Remove password from JSON output
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

export const User = mongoose.model('User', userSchema);
