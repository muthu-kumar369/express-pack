// src/db/ModelBuilder.js
import mongoose from "mongoose";
import { availablePlugins } from "../../plugin/index.js";

export class ModelBuilder {
  static build({ name, schemaDefinition, schemaOptions = {}, plugins = {} }) {
    if (!name || !schemaDefinition) {
      console.error("Model name and schema definition are required.");
    }

    // Avoid redefining models
    if (mongoose.models[name]) {
      return mongoose.models[name];
    }

    const schema = new mongoose.Schema(schemaDefinition, schemaOptions);

    for (const [pluginKey, enabled] of Object.entries(plugins)) {
      if (enabled && typeof availablePlugins[pluginKey] === "function") {
        schema.plugin(availablePlugins[pluginKey]);
      }
    }

    return mongoose.model(name, schema);
  }
}
