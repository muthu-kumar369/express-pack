import dotenv from "dotenv";
import path from "path";

export class DotEnv {
  envLib;
  constructor() {
    this.envLib = dotenv;
  }
  static loadEnv({ customPath = "" }) {
    // get path either custom or default
    const envPath = path.resolve(process.cwd(), customPath || ".env");

    // config dot env
    const env = dotenv.config({ path: envPath });

    // return the parse value
    return env.parsed;
  }
}
