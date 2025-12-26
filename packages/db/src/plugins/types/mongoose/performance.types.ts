// mongoosePerformancePlugin.types.ts
import { Schema, IndexOptions } from "mongoose";

export interface IndexDefinition {
  field: string;
  type?: 1 | -1; // ascending or descending index
  options?: IndexOptions; // mongoose index options
  name?: string; // optional name to verify existing indexes
}

export interface IndexManagerOptions {
  indexes: IndexDefinition[];
}

export interface RetryHandlerOptions {
  retries: number;
  delay: number; // milliseconds
}

export type SchemaPlugin = (schema: Schema) => void;
