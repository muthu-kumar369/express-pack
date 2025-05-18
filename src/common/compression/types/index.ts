import { Application } from "express";
import { CompressionFilter, CompressionOptions } from "compression";

export interface CompressionInitParams {
  app: Application;
  customConfig?: CompressionCustomConfig;
}

export interface CompressionCustomConfig {
  level?: number;
  threshold?: number | string;
  filter?: CompressionFilter;
}
