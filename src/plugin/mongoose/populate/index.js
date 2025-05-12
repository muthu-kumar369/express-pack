import mongoose from "mongoose";

export class MongoosePopulatePlugin {
  // 1. Auto Populate Plugin: Automatically populate references like userId, productId
  static AutoPopulate(options = { paths: [] }) {
    return function (schema) {
      const { paths } = options;

      schema.pre("find", function () {
        this.populate(paths);
      });

      schema.pre("findOne", function () {
        this.populate(paths);
      });

      schema.pre("findOneAndUpdate", function () {
        this.populate(paths);
      });

      schema.pre("updateOne", function () {
        this.populate(paths);
      });

      // Optionally, handle this for save as well if references are part of the document
      schema.pre("save", function (next) {
        paths.forEach((path) => {
          if (this[path] && mongoose.isObjectIdOrHexString(this[path])) {
            this.populate(path); // Trigger population
          }
        });
        next();
      });
    };
  }

  // 2. Smart Population Plugin: Avoid overpopulation loops and depth/field controlled population
  static SmartPopulation(options = { maxDepth: 3, fields: {} }) {
    return function (schema) {
      const { maxDepth, fields } = options;

      // Function to check if population exceeds allowed depth
      const isMaxDepthExceeded = (depth) => {
        return depth > maxDepth;
      };

      // Helper function to build population query
      const buildPopulateQuery = (field, depth = 1) => {
        if (isMaxDepthExceeded(depth)) return field; // Stop population if depth exceeded

        const fieldPopulation = fields[field];
        if (!fieldPopulation) return field; // No need to populate if not defined in the options

        // If the field is a reference, apply smart population based on depth
        return {
          path: field,
          select: fieldPopulation.select || undefined,
          populate: fieldPopulation.populate
            ? buildPopulateQuery(fieldPopulation.populate, depth + 1)
            : undefined,
        };
      };

      schema.pre("find", function () {
        const populateQuery = Object.keys(fields).map((field) =>
          buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      });

      schema.pre("findOne", function () {
        const populateQuery = Object.keys(fields).map((field) =>
          buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      });

      schema.pre("findOneAndUpdate", function () {
        const populateQuery = Object.keys(fields).map((field) =>
          buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      });

      schema.pre("updateOne", function () {
        const populateQuery = Object.keys(fields).map((field) =>
          buildPopulateQuery(field)
        );
        this.populate(populateQuery);
      });

      // Optionally, handle this for save as well if references are part of the document
      schema.pre("save", function (next) {
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
