const helmet = require("helmet");
const securityConfig = require("../../util/config/helmetConfig");

/**
 * Security classs used to setup the security with express app
 */
class Security {
  config;

  constructor() {
    this.config = { ...securityConfig };
  }
  /**
   * Used to setup the security using helmet for app
   * @param {*} app Express app
   * @param {*} customConfig custom configuration if modification needed
   */
  setupSecurity(app, customConfig = {}) {
    this.config = securityConfig?.getConfig(customConfig);
    app.use(helmet(this.config));
  }
}

// create instance
const instance = new Security();

module.exports = {
  SetupSecurity: instance.setupSecurity.bind(instance),
};
