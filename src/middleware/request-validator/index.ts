import { z, ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  ValidatedRequest,
  ValidateRequestOptions,
} from "../types/request-validator.types";

export class RequestValidator {
  static validateRequest({ params, query, body }: ValidateRequestOptions) {
    return (req: ValidatedRequest, res: Response, next: NextFunction) => {
      try {
        const parsed = {
          ...(params ? params.parse(req.params) : {}),
          ...(query ? query.parse(req.query) : {}),
          ...(body ? body.parse(req.body) : {}),
        };

        req.data = parsed;
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({ error: err.flatten() });
        }

        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
}
