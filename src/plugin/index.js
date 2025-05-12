import {
  MongooseCorePlugin,
  MongoosePerformancePlugin,
  MongoosePopulatePlugin,
  MongooseSecurityPlugin,
} from "./mongoose/index.js";

export * from "./mongoose/index.js";

export const availablePlugins = {
  timstamps: MongooseCorePlugin.Timestamps,
  softDelete: MongooseCorePlugin.SoftDelete,
  slugGenerator: MongooseCorePlugin.SlugGenerator,
  versioning: MongooseCorePlugin.Versioning,
  multiTenancy: MongooseCorePlugin.Multitenancy,
  pagination: MongooseCorePlugin.Pagination,
  indexManager: MongoosePerformancePlugin.IndexManager,
  retryHandler: MongoosePerformancePlugin.RetryHandler,
  autoPopulate: MongoosePopulatePlugin.AutoPopulate,
  smartPopulate: MongoosePopulatePlugin.SmartPopulation,
  sanitize: MongooseSecurityPlugin.Sanitization,
  fieldEncryption: MongooseSecurityPlugin.FieldEncryption,
  uniqueContraint: MongooseSecurityPlugin.UniqueConstraint,
  schemaValidation: MongooseSecurityPlugin.SchemaValidation,
};
