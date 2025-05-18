import { Request } from "express";
import { ZodSchema } from "zod";

export interface ValidateRequestOptions {
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
  body?: ZodSchema<any>;
}

export interface ValidatedRequest extends Request {
  data?: any; // You can improve this type by generics if needed
}
