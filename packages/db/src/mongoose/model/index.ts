// modelBuilder.ts
import mongoose from "mongoose";
import { availablePlugins } from "../../plugins/index";
import {
  BuildModelParams,
  MongooseModel,
  PluginFunction,
  PluginKey,
} from "../../types/mongoose/model.types";

export class ModelBuilder {
  static build({
    name,
    schemaDefinition,
    schemaOptions = {},
    plugins = {},
  }: BuildModelParams): MongooseModel {
    if (!name || !schemaDefinition) {
      throw new Error("Model name and schema definition are required.");
    }

    if (mongoose.models[name]) {
      return mongoose.models[name];
    }

    const schema = new mongoose.Schema(schemaDefinition, schemaOptions);

    for (const pluginKey of Object.keys(plugins) as PluginKey[]) {
      const pluginFn: PluginFunction = (availablePlugins as any)[pluginKey];
      const pluginValue = plugins[pluginKey];

      if (pluginFn && typeof pluginFn === "function") {
        if (pluginValue === true) {
          pluginFn(schema); // Plugin without options
        } else {
          pluginFn(schema, pluginValue); // Plugin with options
        }
      }
    }

    return mongoose.model(name, schema);
  }
}
