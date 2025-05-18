import {
  MongooseCorePlugin,
  MongoosePerformancePlugin,
  MongoosePopulatePlugin,
  MongooseSecurityPlugin,
} from "./mongoose/index";

export * from "./mongoose/index";

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
  smartPopulate: MongoosePopulatePlugin.SmartPopulation,
  sanitize: MongooseSecurityPlugin.Sanitization,
  fieldEncryption: MongooseSecurityPlugin.FieldEncryption,
  uniqueConstraint: MongooseSecurityPlugin.UniqueConstraint,
  schemaValidation: MongooseSecurityPlugin.SchemaValidation,
};
