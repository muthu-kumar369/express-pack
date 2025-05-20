// model.types.ts
import {
  SlugDocument,
  SoftDeleteDocument,
  Timestamps,
  VersioningDocument,
} from "@/plugin/types";
import {
  MongooseCorePlugin,
  MongoosePerformancePlugin,
  MongoosePopulatePlugin,
  MongooseSecurityPlugin,
} from "app";
import mongoose from "mongoose";

export type PluginOptionsMap = {
  timestamps: true;
  softDelete: true;
  slugGenerator: true;
  versioning: true;
  multiTenancy: true;
  pagination: true;
  indexManager: true;
  retryHandler: true;
  autoPopulate: true;
  smartPopulate: true;
  sanitize: true;
  fieldEncryption: {
    fields: string[];
  };
  uniqueConstraint: {
    fields: string[];
    messages?: Record<string, string>;
  };
  schemaValidation: {
    validate: Record<string, any>; // can be replaced with Zod types if you're using Zod
  };
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
