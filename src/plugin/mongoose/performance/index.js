import mongoose from "mongoose";

export class MongoosePerformancePlugin {
  // 1. Index Manager Plugin
  static IndexManager(options = { indexes: [] }) {
    return function (schema) {
      const { indexes } = options;

      // Automatically create indexes if not already defined
      indexes.forEach((index) => {
        if (!schema.paths[index.field]) {
          console.warn(`Index field ${index.field} not found in schema`);
          return;
        }

        // Add index if not defined
        schema.index({ [index.field]: index.type || 1 }, index.options || {});
      });

      schema.post("save", function (doc) {
        // Validate indexes post-save or insert
        indexes.forEach(async (index) => {
          const existingIndex = await mongoose.connection.db.listIndexes(
            doc.constructor.collection.name
          );
          const indexExists = existingIndex.some((i) => i.name === index.name);
          if (!indexExists) {
            console.error(
              `Missing index ${index.name} in collection ${doc.constructor.collection.name}`
            );
            // Optionally, you can programmatically add the missing index here
          }
        });
      });
    };
  }

  // 2. Retry Handler Plugin
  static RetryHandler(options = { retries: 3, delay: 1000 }) {
    return function (schema) {
      const { retries, delay } = options;

      // Auto-retry logic for transient failures (like network issues, DB connection issues, etc.)
      schema.pre("save", async function (next) {
        let attempt = 0;
        const saveWithRetry = async () => {
          try {
            await this.save();
            next();
          } catch (err) {
            if (attempt < retries) {
              attempt++;
              console.warn(
                `Retrying save attempt #${attempt} due to error: ${err.message}`
              );
              setTimeout(saveWithRetry, delay);
            } else {
              next(err); // After retries are exhausted, pass the error
            }
          }
        };
        saveWithRetry();
      });
    };
  }
}
