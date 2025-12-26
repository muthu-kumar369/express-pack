import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";
import { z, ZodSchema } from "zod";
import { Schema, Document } from "mongoose";
import {
  FieldEncryptionOptions,
  UniqueConstraintOptions,
  SchemaValidationOptions,
  PreSaveHookThisType,
  PreFindOneAndUpdateHookThisType,
  NextFunction,
} from "../types";

export class MongooseSecurityPlugin {
  static Sanitization(schema: Schema) {
    schema.pre(
      "save",
      function (this: PreSaveHookThisType, next: NextFunction) {
        const sanitize = (value: any) => {
          if (typeof value === "string") {
            return sanitizeHtml(value, {
              allowedTags: [],
              allowedAttributes: {},
            });
          }
          return value;
        };

        Object.keys(this.toObject()).forEach((field) => {
          if (
            this[field] &&
            typeof this[field] === "string" &&
            this[field].trim() !== ""
          ) {
            this[field] = sanitize(this[field]);
          }
        });

        next();
      }
    );
  }

  static FieldEncryption(
    schema: Schema<any>,
    options: FieldEncryptionOptions = { fields: [] }
  ) {
    const { fields } = options;

    schema.pre(
      "save",
      async function (this: PreSaveHookThisType, next: NextFunction) {
        for (const field of fields) {
          if (this[field]) {
            const salt = await bcrypt.genSalt(10);
            this[field] = await bcrypt.hash(this[field], salt);
          }
        }
        next();
      }
    );

    schema.methods.decryptFields = function (
      this: Document & { [key: string]: any }
    ) {
      const decryptedData: Record<string, any> = {};
      fields.forEach((field) => {
        if (this[field]) decryptedData[field] = this[field];
      });
      return decryptedData;
    };

    schema.methods.comparePassword = async function (
      this: Document & { password: string },
      password: string
    ) {
      return bcrypt.compare(password, this.password);
    };
  }

  static UniqueConstraint(schema: Schema, options: UniqueConstraintOptions) {
    const { fields, messages = {} } = options;

    fields.forEach((field) => {
      schema.pre(
        "save",
        async function (this: PreSaveHookThisType, next: NextFunction) {
          if (this.isNew || this.isModified(field)) {
            const query: any = { [field]: this[field] };
            if (this._id) query._id = { $ne: this._id };
            const existingDoc = await this.constructor
              .findOne(query)
              .setOptions({ skipTenantCheck: true });
            if (existingDoc) {
              const errorMessage =
                messages[field] || `${field} already exists.`;
              const error = new Error(errorMessage);
              error.name = "ValidationError";
              next(error);
              return;
            }
          }
          next();
        }
      );

      schema.pre(
        "findOneAndUpdate",
        async function (
          this: PreFindOneAndUpdateHookThisType,
          next: NextFunction
        ) {
          const update = this.getUpdate();
          if (update && update[field]) {
            const query: any = { [field]: update[field] };
            if (this._id) query._id = { $ne: this._id };
            const existingDoc = await this.model
              .findOne(query)
              .setOptions({ skipTenantCheck: true });
            if (existingDoc) {
              const errorMessage =
                messages[field] || `${field} already exists.`;
              const error = new Error(errorMessage);
              error.name = "ValidationError";
              next(error);
              return;
            }
          }
          next();
        }
      );
    });
  }

  static SchemaValidation(
    schema: Schema<any>,
    options: SchemaValidationOptions = { validate: {} }
  ) {
    const { validate } = options;

    schema.pre(
      "save",
      async function (this: PreSaveHookThisType, next: NextFunction) {
        try {
          Object.keys(validate).forEach((field) => {
            const validationSchema: ZodSchema = validate[field];
            if (this[field]) {
              validationSchema.parse(this[field]);
            }
          });
          next();
        } catch (err: any) {
          next(err);
        }
      }
    );

    schema.methods.validateSchema = function (this: any, data: any) {
      try {
        Object.keys(validate).forEach((field) => {
          const validationSchema: ZodSchema = validate[field];
          if (data[field]) {
            validationSchema.parse(data[field]);
          }
        });
      } catch (err: any) {
        throw new Error(`Validation failed for ${err.message}`);
      }
    };
  }
}
