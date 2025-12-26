import { CompressionCustomConfig } from "../../common/compression/types";
import compression, { CompressionFilter } from "compression";
import { Request, Response } from "express";

const config = {
  getConfig: (config: CompressionCustomConfig = {}) => {
    const filter: CompressionFilter =
      config.filter ??
      ((req: Request, res: Response) => {
        if (req.headers["x-no-compression"]) return false; // Skip compression if client requests no compression
        return compression.filter(req, res);
      });

    return {
      level: config.level ?? 6, // Compression level (0-9) for Gzip
      threshold: config.threshold ?? 1024, // Only compress responses larger than 1KB
      filter,
    };
  },
};

export default config;
