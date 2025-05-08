import compression from "compression";
import compressConfig from "../../config/common/compressionConfig.js";

/**
 * Used to setup compress middleware in express
 */
export class CompressionHandler {
  /**
   * @param {*} app Express app
   * @param {*} customConfig Custome configuration for compress
   */
  static setupCompress({ app, customConfig = {} }) {
    const config = compressConfig.getConfig(customConfig);

    // use compress with config details
    app.use(compression(config));
  }

  static compression() {
    return compression;
  }
}
