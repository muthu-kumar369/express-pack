// types/response.util.ts
import type { Request, Response } from "express";

export interface ResponseUtilData {
  [key: string]: any;
}

export interface ResponseUtilSend {
  (
    req: Request & { requestId?: string },
    res: Response & { locale?: string },
    code: string,
    data?: ResponseUtilData
  ): any;
}
