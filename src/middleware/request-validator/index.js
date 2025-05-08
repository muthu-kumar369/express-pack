import { z } from "zod";

export class RequestValidator {
  static validateRequest({ params, query, body }) {
    return (req, res, next) => {
      try {
        const parsed = {
          ...(params ? params.parse(req.params) : {}),
          ...(query ? query.parse(req.query) : {}),
          ...(body ? body.parse(req.body) : {}),
        };

        req.data = parsed;
        next();
      } catch (err) {
        // Zod throws a ZodError object
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: err.flatten() });
        }

        // Unknown error
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  }
}
