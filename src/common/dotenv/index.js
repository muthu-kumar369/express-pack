const dotenv = require("dotenv");
const path = require("path");

class DotEnv {
  envLib;
  constructor() {
    this.envLib = dotenv;
  }
  loadEnv(customPath = "") {
    // get path either custom or default
    const envPath = path.resolve(process.cwd(), customPath || ".env");

    // config dot env
    const env = this.envLib.config({ path: envPath });

    // return the parse value
    return env.parsed;
  }
}

const instance = new DotEnv();

module.exports = {
  LoadEnv: instance.loadEnv.bind(instance),
};
