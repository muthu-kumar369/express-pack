import type { Schema, Document, Query, Model } from "mongoose";
import slugify from "slugify";
import {
  Timestamps,
  SoftDeleteQueryHelpers,
  VersioningDocument,
  MultiTenancyOptions,
  TenantQueryHelpers,
  MultiTenancyDocument,
  PaginationOptions,
  PaginationResult,
  PaginationModel,
  HookNextFunction,
  SoftDeleteDocument,
  SlugDocument,
} from "../../types/mongoose/core.types";

export class MongooseCorePlugin {
  static Timestamps(schema: Schema<any>) {
    schema.add({
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    schema.pre<Timestamps & Document>(
      "save",
      function (next: HookNextFunction) {
        if (!this.createdAt) this.createdAt = new Date();
        this.updatedAt = new Date();
        next();
      }
    );

    schema.pre<Query<any, Timestamps>>(
      "findOneAndUpdate",
      function (next: HookNextFunction) {
        this.set({ updatedAt: new Date() });
        next();
      }
    );
  }

  static SoftDelete(schema: Schema<any>, option: {}) {
    schema.add({
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null },
    });

    // Add softDelete method to documents
    schema.methods.softDelete = async function (this: SoftDeleteDocument) {
      if (!this.isDeleted) {
        this.isDeleted = true;
        this.deletedAt = new Date();
        return this.save();
      }
      throw new Error("Document is already deleted");
    };

    // Add notDeleted query helper
    (schema.query as SoftDeleteQueryHelpers).notDeleted = function (
      this: Query<any, SoftDeleteDocument> & SoftDeleteQueryHelpers
    ) {
      return this.where({ isDeleted: false });
    };

    // Add notDeleted query helper
    (schema.query as SoftDeleteQueryHelpers).withDeleted = function (
      this: Query<any, SoftDeleteDocument> & SoftDeleteQueryHelpers
    ) {
      return this.where({ isDeleted: true });
    };

    // Exclude deleted documents automatically on these queries
    const excludeDeleted = function (
      this: Query<any, SoftDeleteDocument>,
      next: HookNextFunction
    ) {
      this.where({ isDeleted: false });
      next();
    };

    schema.pre("find", excludeDeleted);
    schema.pre("findOne", excludeDeleted);
    schema.pre("countDocuments", excludeDeleted);
  }

  static SlugGenerator(
    schema: Schema<any>,
    options: { sourceField?: string; slugField?: string; unique?: boolean } = {}
  ) {
    const { sourceField = "name", slugField = "slug", unique = true } = options;

    schema.add({ [slugField]: { type: String, unique } });

    schema.pre(
      "validate",
      async function (this: SlugDocument, next: HookNextFunction) {
        const sourceValue = this[sourceField];

        if (!this[slugField] && sourceValue) {
          let baseSlug = slugify(sourceValue, {
            lower: true,
            strict: true,
          });
          if (!baseSlug || baseSlug === "") baseSlug = "untitled-slug";

          let slug = baseSlug;
          let count = 1;

          const query: any = { [slugField]: slug };
          if (this._id) query._id = { $ne: this._id };

          // Cast constructor to Model<SlugDocument> to access `exists`
          const ModelConstructor = this.constructor as Model<SlugDocument>;

          const checkUniqueness = async (): Promise<string> => {
            const existing = await ModelConstructor.exists(query);
            if (existing) {
              slug = `${baseSlug}-${count++}`;
              query[slugField] = slug;
              return checkUniqueness();
            }
            return slug;
          };

          this[slugField] = await checkUniqueness();
        }

        next();
      }
    );
  }

  static Versioning(schema: Schema<any>) {
    const versionField = "__versions";

    schema.add({
      [versionField]: { type: Array, default: [] },
    });

    schema.pre<VersioningDocument>(
      "save",
      async function (next: HookNextFunction) {
        if (!this.isNew && this.isModified()) {
          const clone = this.toObject({ depopulate: true });
          delete clone[versionField];
          this[versionField] = this[versionField] || [];
          this[versionField].push({
            version: this[versionField].length + 1,
            data: clone,
            savedAt: new Date(),
          });

          if (this[versionField].length > 10) {
            this[versionField].shift();
          }
        }
        next();
      }
    );
  }

  static MultiTenancy(schema: Schema<any>, options: MultiTenancyOptions = {}) {
    const field = options.field || "shopId";

    schema.add({ [field]: { type: String, required: true, index: true } });

    const addTenantScope = function (
      this: Query<any, any> & TenantQueryHelpers,
      next: HookNextFunction
    ) {
      if (!this.getQuery()[field] && this.options?.tenantId) {
        this.where({ [field]: this.options.tenantId });
      }

      if (!this.getQuery()[field]) {
        const error = new Error("Tenant ID is required but was not provided.");
        next(error);
        return;
      }

      next();
    };

    schema.pre(
      "save",
      function (this: MultiTenancyDocument, next: HookNextFunction) {
        if (!this[field] && this.tenantId) {
          this[field] = this.tenantId;
        }

        if (!this[field]) {
          const error = new Error(
            `The ${field} is required to save this document.`
          );
          next(error);
          return;
        }

        next();
      }
    );

    schema.pre("find", addTenantScope);
    schema.pre("findOne", addTenantScope);
    schema.pre("countDocuments", addTenantScope);
  }

  static Pagination(schema: Schema<any, PaginationModel<any>>) {
    schema.statics.paginate = async function ({
      page = 1,
      limit = 10,
      filter = {},
      sort = {},
    }: PaginationOptions = {}): Promise<PaginationResult<any>> {
      if (page <= 0) page = 1;
      if (limit <= 0) limit = 10;

      const skip = (page - 1) * limit;
      const [results, total] = await Promise.all([
        this.find(filter).sort(sort).skip(skip).limit(limit),
        this.countDocuments(filter),
      ]);

      return {
        results,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    };
  }
}
