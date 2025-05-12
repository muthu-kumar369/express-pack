// common/compression.js

import compression from "compression";
import compressConfig from "../../config/common/compressionConfig.js";

export class CompressionHandler {
  static #initialized = false;

  /**
   * Set up compression middleware once
   * @param {*} app Express app
   * @param {*} customConfig Optional custom configuration
   */
  static init({ app, customConfig = {} }) {
    if (this.#initialized) return;

    const config = compressConfig.getConfig(customConfig);
    app.use(compression(config));

    this.#initialized = true;
  }

  /**
   * Direct access to compression function (if needed elsewhere)
   */
  static getMiddleware(config = {}) {
    return compression(config);
  }

  static isInitialized() {
    return this.#initialized;
  }
}

export default CompressionHandler;
