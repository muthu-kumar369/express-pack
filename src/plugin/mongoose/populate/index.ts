import mongoose, { Schema } from "mongoose";
import {
  AutoPopulateOptions,
  SmartPopulationOptions,
  SaveHookThisType,
  SchemaPreHookFunction,
  NextFunction,
} from "../../types/mongoose/populate.types";

export class MongoosePopulatePlugin {
  static AutoPopulate(
    schema: Schema<any>,
    options: AutoPopulateOptions = { paths: [] }
  ) {
    return function (schema: Schema) {
      const { paths } = options;

      const preHook: SchemaPreHookFunction = function () {
        this.populate(paths);
      };

      schema.pre("find", preHook);
      schema.pre("findOne", preHook);
      schema.pre("findOneAndUpdate", preHook);
      schema.pre("updateOne", preHook);

      schema.pre("save", function (this: SaveHookThisType, next: NextFunction) {
        paths.forEach((path) => {
          if (this[path] && mongoose.isObjectIdOrHexString(this[path])) {
            this.populate(path); // Trigger population
          }
        });
        next();
      });
    };
  }

  static SmartPopulation(
    schema: Schema<any>,
    options: SmartPopulationOptions = { maxDepth: 3, fields: {} }
  ) {
    return function (schema: Schema) {
      const { maxDepth, fields } = options;

      const isMaxDepthExceeded = (depth: number) => depth > maxDepth;

      const buildPopulateQuery = (field: string, depth = 1): any => {
        if (isMaxDepthExceeded(depth)) return field;

        const fieldPopulation = fields[field];
        if (!fieldPopulation) return field;

        return {
          path: field,
          select: fieldPopulation.select || undefined,
          populate: fieldPopulation.populate
            ? buildPopulateQuery(fieldPopulation.populate, depth + 1)
            : undefined,
        };
      };

      const preHook: SchemaPreHookFunction = function () {
        const populateQuery = Object.keys(fields).map((field) =>
          buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      };

      schema.pre("find", preHook);
      schema.pre("findOne", preHook);
      schema.pre("findOneAndUpdate", preHook);
      schema.pre("updateOne", preHook);

      schema.pre("save", function (this: SaveHookThisType, next: NextFunction) {
        Object.keys(fields).forEach((field) => {
          if (this[field] && mongoose.isObjectIdOrHexString(this[field])) {
            this.populate(buildPopulateQuery(field));
          }
        });
        next();
      });
    };
  }
}
