import mongoose from 'mongoose';
import { TimestampPlugin } from 'express-pack';

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subdomain: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            default: 'free',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'trial', 'suspended'],
            default: 'trial',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        expiresAt: Date,
    },
    limits: {
        users: { type: Number, default: 5 },
        storage: { type: Number, default: 1024 }, // MB
        apiCalls: { type: Number, default: 1000 }, // per month
    },
    usage: {
        users: { type: Number, default: 0 },
        storage: { type: Number, default: 0 },
        apiCalls: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now },
    },
    settings: {
        timezone: { type: String, default: 'UTC' },
        language: { type: String, default: 'en' },
        customDomain: String,
    },
});

tenantSchema.plugin(TimestampPlugin);

// Reset usage monthly
tenantSchema.methods.resetUsage = function () {
    this.usage.apiCalls = 0;
    this.usage.lastReset = new Date();
    return this.save();
};

export const Tenant = mongoose.model('Tenant', tenantSchema);
