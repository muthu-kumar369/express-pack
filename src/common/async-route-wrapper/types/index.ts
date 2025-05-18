import { Request, Response, NextFunction, RequestHandler } from "express";

// A function that takes typical Express args and returns a promise or void
export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;
