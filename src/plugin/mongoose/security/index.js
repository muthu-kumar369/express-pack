import bcrypt from "bcryptjs"; // bcryptjs package for hashing and comparing passwords
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export class MongooseSecurityPlugin {
  // 1. Sanitization Plugin: Strips HTML/scripts to prevent XSS/HTML injection
  static Sanitization(schema) {
    schema.pre("save", function (next) {
      const sanitize = (value) => {
        if (typeof value === "string") {
          return sanitizeHtml(value, {
            allowedTags: [], // Remove all HTML tags
            allowedAttributes: {}, // Remove all attributes
          });
        }
        return value;
      };

      // Apply sanitization to all user-input fields that are strings
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
    });
  }

  // 2. Field Encryption Plugin: Encrypt sensitive fields before saving
  static FieldEncryption(schema, options = { fields: [] }) {
    const { fields } = options;

    // Encrypt specified fields before saving the document
    schema.pre("save", async function (next) {
      for (const field of fields) {
        if (this[field]) {
          const salt = await bcrypt.genSalt(10);
          this[field] = await bcrypt.hash(this[field], salt);
        }
      }
      next();
    });

    // Decrypt specified fields when retrieving the document
    schema.methods.decryptFields = function () {
      const decryptedData = {};
      fields.forEach((field) => {
        if (this[field]) decryptedData[field] = this[field];
      });
      return decryptedData;
    };

    // Method to compare password during authentication
    schema.methods.comparePassword = async function (password) {
      return bcrypt.compare(password, this.password);
    };
  }

  // 3. Unique Constraint Plugin: Custom error messages for duplicate fields (Slugs, Emails, Shop Names)
  static UniqueConstraint(schema, options = { fields: [], messages: {} }) {
    const { fields, messages } = options;

    fields.forEach((field) => {
      schema.pre("save", async function (next) {
        if (this.isNew || this.isModified(field)) {
          const query = { [field]: this[field] };
          if (this._id) query._id = { $ne: this._id }; // Exclude current document
          const existingDoc = await this.constructor.findOne(query);

          if (existingDoc) {
            const errorMessage = messages[field] || `${field} already exists.`;
            const error = new Error(errorMessage);
            error.name = "ValidationError";
            next(error);
            return;
          }
        }
        next();
      });

      // Ensure uniqueness for updates as well
      schema.pre("findOneAndUpdate", async function (next) {
        const update = this.getUpdate();
        if (update[field]) {
          const query = { [field]: update[field] };
          query._id = { $ne: this._id }; // Exclude current document
          const existingDoc = await this.model.findOne(query);
          if (existingDoc) {
            const errorMessage = messages[field] || `${field} already exists.`;
            const error = new Error(errorMessage);
            error.name = "ValidationError";
            next(error);
            return;
          }
        }
        next();
      });
    });
  }

  // 4. Schema Validation Plugin: Using Zod for input validation
  static SchemaValidation(schema, options = { validate: {} }) {
    const { validate } = options;

    // Validate schema fields using Zod
    schema.pre("save", async function (next) {
      try {
        // Perform Zod validation for each field defined in 'validate'
        Object.keys(validate).forEach((field) => {
          const validationSchema = validate[field];
          if (this[field]) {
            validationSchema.parse(this[field]); // Validate field with Zod
          }
        });
        next();
      } catch (err) {
        // Pass error to next to indicate validation failure
        next(err);
      }
    });

    // Example of how to validate using Zod method
    schema.methods.validateSchema = function (data) {
      try {
        Object.keys(validate).forEach((field) => {
          const validationSchema = validate[field];
          if (data[field]) {
            validationSchema.parse(data[field]);
          }
        });
      } catch (err) {
        throw new Error(`Validation failed for ${err.message}`);
      }
    };
  }
}
