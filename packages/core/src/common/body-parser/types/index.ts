import {
  Options,
  OptionsJson,
  OptionsText,
  OptionsUrlencoded,
} from "body-parser";
import { Application } from "express";

export interface BodyParserInitParams {
  app: Application;
  customConfig?: BodyParserCustomConfig; // You can replace `any` with a more strict config type if available
}

export interface BodyParserCustomConfig {
  json?: OptionsJson;
  urlencoded?: OptionsUrlencoded;
  raw?: Options;
  text?: OptionsText;
}
