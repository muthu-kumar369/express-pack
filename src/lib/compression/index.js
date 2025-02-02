const compression = require("compression");
const { getConfig } = require("./config");

/**
 * Used to setup compress middleware in express
 */
class Compression {
  /**
   * @param {*} app Express app
   * @param {*} customConfig Custome configuration for compress
   */
  setupCompress(app, customConfig) {
    const config = getConfig(customConfig);

    // use compress with config details
    app.use(compression(config));
  }

  compression() {
    return compression;
  }
}

const instance = new Compression();

module.exports = {
  SetupCompression: instance.setupCompress,
  compression: instance.compression,
};
