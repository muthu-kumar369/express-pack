import mongoose, { Schema } from "mongoose";
import {
  IndexManagerOptions,
  RetryHandlerOptions,
  IndexDefinition,
  SchemaPlugin,
} from "../types/mongoose/performance.types";

export class MongoosePerformancePlugin {
  // 1. Index Manager Plugin
  static IndexManager(
    schema: Schema<any>,
    options: IndexManagerOptions = { indexes: [] }
  ): SchemaPlugin {
    return function (schema: Schema) {
      const { indexes } = options;

      const db = mongoose.connection.db;
      if (!db) {
        console.warn("MongoDB connection not established yet.");
        return;
      }

      indexes.forEach((index: IndexDefinition) => {
        if (!schema.path(index.field)) {
          console.warn(`Index field ${index.field} not found in schema`);
          return;
        }

        schema.index({ [index.field]: index.type || 1 }, index.options || {});
      });

      schema.post("save", function (doc) {
        const db = mongoose.connection.db;
        if (!db) {
          console.warn("MongoDB connection not established yet.");
          return;
        }

        const collectionName = (doc.constructor as any).collection?.name;
        if (!collectionName) {
          console.warn("Collection name is not accessible");
          return;
        }

        indexes.forEach(async (index: IndexDefinition) => {
          try {
            const indexesCursor = db.collection(collectionName).listIndexes();
            const existingIndexes = await indexesCursor.toArray();

            const indexExists = existingIndexes.some(
              (i: { name: string }) => i.name === index.name
            );

            if (!indexExists) {
              console.error(
                `Missing index ${index.name} in collection ${collectionName}`
              );
              // Optionally create index here
            }
          } catch (error) {
            console.error("Error checking indexes:", error);
          }
        });
      });
    };
  }

  // 2. Retry Handler Plugin
  static RetryHandler(
    schema: Schema<any>,
    options: RetryHandlerOptions = { retries: 3, delay: 1000 }
  ) {
    const { retries, delay } = options;

    schema.methods.saveWithRetry = async function () {
      let attempt = 0;

      while (attempt <= retries) {
        try {
          return await this.save();
        } catch (err: any) {
          if (attempt < retries) {
            attempt++;
            console.warn(
              `Retrying save attempt #${attempt} due to error: ${err.message}`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw err;
          }
        }
      }
    };
  }
}
