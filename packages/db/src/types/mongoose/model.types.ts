import {
  AutoPopulateOptions,
  FieldEncryptionOptions,
  IndexManagerOptions,
  MultiTenancyOptions,
  PaginationModel,
  PaginationOptions,
  PaginationResult,
  RetryHandlerOptions,
  SchemaValidationOptions,
  SmartPopulationOptions,
  UniqueConstraintOptions,
} from "../../plugins/types";
import mongoose from "mongoose";

export interface ISlugGenerator {
  sourceField?: string;
  slugField?: string;
  unique?: boolean;
}

export type PluginOptionsMap = {
  timestamps: boolean;
  softDelete: boolean;
  slugGenerator: ISlugGenerator;
  versioning: boolean;
  multiTenancy: MultiTenancyOptions;
  pagination: boolean;
  indexManager: IndexManagerOptions;
  retryHandler: RetryHandlerOptions;
  autoPopulate: AutoPopulateOptions;
  smartPopulate: SmartPopulationOptions;
  sanitize: boolean;
  fieldEncryption: FieldEncryptionOptions;
  uniqueConstraint: UniqueConstraintOptions;
  schemaValidation: SchemaValidationOptions;
};

export type PluginKey = keyof PluginOptionsMap;

export type PluginsConfig = {
  [K in PluginKey]?: PluginOptionsMap[K];
};

export interface BuildModelParams {
  name: string;
  schemaDefinition: mongoose.SchemaDefinition;
  schemaOptions?: mongoose.SchemaOptions;
  plugins?: PluginsConfig;
}

export type MongooseModel = mongoose.Model<any>;

export type PluginFunction = (schema: mongoose.Schema, options?: any) => void;

// export interface PluginDocumentTypes {
//    timestamps: Timestamps;
//   softDelete: SoftDeleteDocument;
//   slugGenerator: SlugDocument;
//   versioning: VersioningDocument;
//   multiTenancy:
//   pagination:
//   indexManager:
//   retryHandler:
//   autoPopulate:
//   smartPopulate:
//   sanitize:
//   fieldEncryption:
//   uniqueConstraint:
//   schemaValidation:
// }

// export const availablePlugins = {
//   timestamps: MongooseCorePlugin.Timestamps,
//   softDelete: MongooseCorePlugin.SoftDelete,
//   slugGenerator: MongooseCorePlugin.SlugGenerator,
//   versioning: MongooseCorePlugin.Versioning,
//   multiTenancy: MongooseCorePlugin.MultiTenancy,
//   pagination: MongooseCorePlugin.Pagination,
//   indexManager: MongoosePerformancePlugin.IndexManager,
//   retryHandler: MongoosePerformancePlugin.RetryHandler,
//   autoPopulate: MongoosePopulatePlugin.AutoPopulate,
//   smartPopulate: MongoosePopulatePlugin.SmartPopulation,
//   sanitize: MongooseSecurityPlugin.Sanitization,
//   fieldEncryption: MongooseSecurityPlugin.FieldEncryption,
//   uniqueConstraint: MongooseSecurityPlugin.UniqueConstraint,
//   schemaValidation: MongooseSecurityPlugin.SchemaValidation,
// };
