import slugify from "slugify";

export class MongooseCorePlugin {
  // 1. Timestamps Plugin
  static Timestamps(schema) {
    schema.add({
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    schema.pre("save", function (next) {
      if (!this.createdAt) this.createdAt = new Date();
      this.updatedAt = new Date();
      next();
    });

    schema.pre("findOneAndUpdate", function (next) {
      this.set({ updatedAt: new Date() });
      next();
    });
  }

  // 2. Soft Delete Plugin
  static SoftDelete(schema) {
    schema.add({
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null },
    });

    schema.methods.softDelete = async function () {
      if (!this.isDeleted) {
        this.isDeleted = true;
        this.deletedAt = new Date();
        return this.save();
      }
      throw new Error("Document is already deleted");
    };

    schema.query.notDeleted = function () {
      return this.where({ isDeleted: false });
    };

    const excludeDeleted = function (next) {
      this.where({ isDeleted: false });
      next();
    };

    schema.pre("find", excludeDeleted);
    schema.pre("findOne", excludeDeleted);
    schema.pre("countDocuments", excludeDeleted);
  }

  // 3. Slug Generator Plugin
  static SlugGenerator(schema, options = {}) {
    const { sourceField = "name", slugField = "slug", unique = true } = options;
    schema.add({ [slugField]: { type: String, unique } });

    schema.pre("validate", async function (next) {
      if (!this[slugField] && this[sourceField]) {
        let baseSlug = slugify(this[sourceField], {
          lower: true,
          strict: true,
        });
        if (!baseSlug || baseSlug === "") baseSlug = "untitled-slug"; // Fallback if the source is empty or invalid

        let slug = baseSlug;
        let count = 1;

        const query = { [slugField]: slug };
        if (this._id) query._id = { $ne: this._id };

        // Retry mechanism for ensuring uniqueness
        const checkUniqueness = async () => {
          const existing = await this.constructor.exists(query);
          if (existing) {
            slug = `${baseSlug}-${count++}`;
            query[slugField] = slug;
            return await checkUniqueness(); // Retry if a conflict is found
          }
          return slug; // Return the unique slug if no conflict
        };

        this[slugField] = await checkUniqueness();
      }

      next();
    });
  }

  // 4. Versioning Plugin
  static Versioning(schema) {
    const versionField = "__versions";

    schema.add({
      [versionField]: { type: Array, default: [] },
    });

    schema.pre("save", async function (next) {
      if (!this.isNew && this.isModified()) {
        const clone = this.toObject({ depopulate: true });
        delete clone[versionField];
        this[versionField].push({
          version: this[versionField].length + 1,
          data: clone,
          savedAt: new Date(),
        });

        // Optional: Limit the number of versions stored (e.g., keep the last 10 versions)
        if (this[versionField].length > 10) {
          this[versionField].shift(); // Remove the oldest version
        }
      }
      next();
    });
  }

  // 5. Multitenancy Plugin
  static Multitenancy(schema, options = {}) {
    const field = options.field || "shopId";

    schema.add({ [field]: { type: String, required: true, index: true } });

    // Add tenant scope to queries
    const addTenantScope = function (next) {
      if (!this.getQuery()[field] && this.options.tenantId) {
        this.where({ [field]: this.options.tenantId });
      }

      // If tenantId is still missing in the query, throw an error
      if (!this.getQuery()[field]) {
        const error = new Error("Tenant ID is required but was not provided.");
        next(error);
        return;
      }

      next();
    };

    // Pre-save: Ensure tenant ID is assigned if missing
    schema.pre("save", function (next) {
      if (!this[field] && this.tenantId) {
        this[field] = this.tenantId;
      }

      // If tenantId is missing in the document, throw an error
      if (!this[field]) {
        const error = new Error(
          `The ${field} is required to save this document.`
        );
        next(error);
        return;
      }

      next();
    });

    // Pre-query hooks to ensure tenant scope
    schema.pre("find", addTenantScope);
    schema.pre("findOne", addTenantScope);
    schema.pre("countDocuments", addTenantScope);
  }

  // 6. Pagination Plugin
  static Pagination(schema) {
    schema.statics.paginate = async function ({
      page = 1,
      limit = 10,
      filter = {},
      sort = {},
    } = {}) {
      // Ensure page and limit are positive numbers
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
