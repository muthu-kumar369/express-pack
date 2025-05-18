import { Schema, Document, CallbackError } from "mongoose";
import { ZodSchema } from "zod";

export interface SanitizationOptions {}

export interface FieldEncryptionOptions {
  fields: string[];
}

export interface UniqueConstraintOptions {
  fields: string[];
  messages?: { [field: string]: string };
}

export interface SchemaValidationOptions {
  validate: { [field: string]: ZodSchema<any> };
}

// 'this' context for schema pre-save hooks
export interface PreSaveHookThisType extends Document {
  [key: string]: any;
  isNew: boolean;
  isModified: (field: string) => boolean;
  constructor: any;
}

// 'this' context for schema pre-findOneAndUpdate hooks
export interface PreFindOneAndUpdateHookThisType {
  getUpdate: () => any;
  model: any;
  _id?: any;
}

export interface SchemaWithMethods extends Schema {
  methods: {
    [key: string]: (...args: any[]) => any;
  };
}
