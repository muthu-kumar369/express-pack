import compression, { CompressionOptions } from "compression";
import compressConfig from "../../config/common/compressionConfig";
import { CompressionInitParams } from "./types";

export class CompressionHandler {
  static #initialized = false;

  /**
   * Set up compression middleware once
   */
  static init({ app, customConfig = {} }: CompressionInitParams): void {
    if (this.#initialized) return;

    const config = compressConfig.getConfig(customConfig);
    app.use(compression(config));
    this.#initialized = true;
  }

  /**
   * Direct access to compression middleware
   */
  static getMiddleware(
    config: CompressionOptions = {}
  ): ReturnType<typeof compression> {
    return compression(config);
  }

  static isInitialized(): boolean {
    return this.#initialized;
  }
}

export default CompressionHandler;
