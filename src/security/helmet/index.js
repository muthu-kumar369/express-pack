import helmet from "helmet";
import securityConfig from "../../config/security/helmetConfig.js";

/**
 * Security classs used to setup the security with express app
 */
export class SecurityHandler {
  config;

  constructor() {
    this.config = { ...securityConfig };
  }
  /**
   * Used to setup the security using helmet for app
   * @param {*} app Express app
   * @param {*} customConfig custom configuration if modification needed
   */
  static setupSecurity({ app, customConfig = {} }) {
    this.config = securityConfig?.getConfig(customConfig);
    app.use(helmet(this.config));
  }
}
