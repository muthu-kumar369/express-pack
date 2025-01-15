const cors = require("cors");
const { corsConfig } = require("./config");

/**
 * Cors class used to setup the cors origin
 */
class Cors {
  // variable that used around the class
  defaultConfig;
  customConfig;

  constructor() {
    this.defaultConfig = { ...corsConfig };
  }

  /**
   * Used to setup the cors for app
   * @param {*} app Express app
   * @param {*} customConfig config for cors
   */
  setupCors(app, customConfig = {}) {
    this.customConfig = customConfig;

    // if we get custom config then get the cors config or else use deafult
    const config = Object.keys(customConfig)?.length
      ? this.getCorsConfig()
      : { ...this.defaultConfig };

    app.use(cors(config));
  }

  /**
   * Used to check allow origin, block origin and return the config
   * @returns config details for cors
   */
  getCorsConfig() {
    const {
      allowOrigins = [],
      blockOrigins = [],
      ...remainConfig
    } = this.customConfig;

    const originHandler = (origin, callback) => {
      // Allow if no origin in the request (e.g., same-origin requests)
      if (!origin) return callback(null, true);

      // Blocklisted origins
      if (blockOrigins.some((blocked) => this.matchOrigin(origin, blocked))) {
        return callback(new Error("Blocked by CORS policy"));
      }

      // Allowlisted origins
      if (
        allowOrigins.length === 0 ||
        allowOrigins.some((allowed) => this.matchOrigin(origin, allowed))
      ) {
        return callback(null, true);
      }

      // Reject if not explicitly allowed
      callback(new Error("Not allowed by CORS policy"));
    };

    return {
      ...this.defaultConfig,
      ...remainConfig,
      origin: originHandler,
    };
  }

  /**
   * Used to check whether origin allow or not
   * @param {*} origin Origin value
   * @param {*} pattern Pattern or origin to validate
   * @returns
   */
  matchOrigin(origin, pattern) {
    if (typeof pattern === "string") return origin === pattern;
    if (pattern instanceof RegExp) return pattern.test(origin);
    return false;
  }
}

// create instance
const instance = new Cors();

module.exports = {
  SetupCors: instance.setupCors.bind(instance),
};
