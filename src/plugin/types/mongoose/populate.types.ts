import {
  Schema,
  Document,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

export interface AutoPopulateOptions {
  paths: string[];
}

export interface SmartPopulationField {
  select?: string | string[];
  populate?: string;
}

export interface SmartPopulationFields {
  [field: string]: SmartPopulationField;
}

export interface SmartPopulationOptions {
  maxDepth: number;
  fields: SmartPopulationFields;
}

export type PreHookThisType = {
  populate: (path: string | any[]) => any;
  [key: string]: any;
};

export type SaveHookThisType = Document & {
  [key: string]: any;
  populate: (path: string | any[]) => any;
};

export type NextFunction = CallbackWithoutResultAndOptionalError;

export type SchemaMiddlewareFunction = (
  this: PreHookThisType,
  next: NextFunction
) => void;

export type SchemaPreHookFunction = (this: PreHookThisType) => void;
