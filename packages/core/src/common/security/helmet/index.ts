import helmet, { HelmetOptions } from "helmet";
import securityConfig from "../../../config/security/helmetConfig";
import { HelmetInitOptions } from "../types";

/**
 * Security class used to setup helmet security middleware with express app
 */
export class SecurityHandler {
  static config: HelmetOptions;

  /**
   * Used to setup the security using helmet for app
   * @param app Express app
   * @param customConfig custom configuration if modification needed
   */
  static init({ app, customConfig = {} }: HelmetInitOptions): void {
    this.config = securityConfig?.getConfig(customConfig);
    app.use(helmet(this.config));
  }
}
