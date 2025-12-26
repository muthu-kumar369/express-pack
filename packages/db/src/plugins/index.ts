export * from './core/index.js';
export * from './performance/index.js';
export * from './populate/index.js';
export * from './security/index.js';
export * from './types.js';

import { MongooseCorePlugin } from './core/index';
import { MongoosePerformancePlugin } from './performance/index';
import { MongoosePopulatePlugin } from './populate/index';
import { MongooseSecurityPlugin } from './security/index';

export const availablePlugins = {
    timestamps: MongooseCorePlugin.Timestamps,
    softDelete: MongooseCorePlugin.SoftDelete,
    slugGenerator: MongooseCorePlugin.SlugGenerator,
    versioning: MongooseCorePlugin.Versioning,
    multiTenancy: MongooseCorePlugin.MultiTenancy,
    pagination: MongooseCorePlugin.Pagination,
    indexManager: MongoosePerformancePlugin.IndexManager,
    retryHandler: MongoosePerformancePlugin.RetryHandler,
    autoPopulate: MongoosePopulatePlugin.AutoPopulate,
    smartPopulation: MongoosePopulatePlugin.SmartPopulation,
    sanitize: MongooseSecurityPlugin.Sanitization,
    fieldEncryption: MongooseSecurityPlugin.FieldEncryption,
    uniqueConstraint: MongooseSecurityPlugin.UniqueConstraint,
    schemaValidation: MongooseSecurityPlugin.SchemaValidation,
};
