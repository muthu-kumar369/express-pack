import { Application } from "express";
import { HelmetOptions } from "helmet";

export interface HelmetInitOptions {
  app: Application;
  customConfig?: Partial<HelmetOptions>;
}
