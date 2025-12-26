import type { Document, Query, Model } from "mongoose";

export interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt?: Date | null;
  softDelete: () => Promise<SoftDeleteDocument>;
}

export interface SoftDeleteQueryHelpers {
  notDeleted(): Query<any, SoftDeleteDocument> & SoftDeleteQueryHelpers;
  withDeleted(): Query<any, SoftDeleteDocument> & SoftDeleteQueryHelpers;
}

export interface SlugGeneratorOptions {
  sourceField?: string;
  slugField?: string;
  unique?: boolean;
}

export interface SlugDocument extends Document {
  [key: string]: any; // Allow dynamic keys
}

export interface VersioningDocument extends Document {
  __versions?: VersionEntry[];
  isModified(): boolean;
  toObject(options?: any): Record<string, any>;
}

export interface VersionEntry {
  version: number;
  data: any;
  savedAt: Date;
}

export interface MultiTenancyOptions {
  field?: string;
}

export interface TenantQueryHelpers {
  options: {
    tenantId?: string;
  };
}

export interface MultiTenancyDocument extends Document {
  tenantId?: string;
  [key: string]: any; // for dynamic field access
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  filter?: Record<string, any>;
  sort?: Record<string, any>;
}

export interface PaginationResult<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationModel<T extends Document> extends Model<T> {
  paginate(opts?: PaginationOptions): Promise<PaginationResult<T>>;
}

export type HookNextFunction = (error?: Error) => void;
