import dotenv, { DotenvConfigOutput } from "dotenv";
import path from "path";

export class DotEnv {
  envLib: typeof dotenv;

  constructor() {
    this.envLib = dotenv;
  }

  static init({ customPath = "" }): DotenvConfigOutput["parsed"] | undefined {
    const envPath = path.resolve(process.cwd(), customPath || ".env");

    const env = dotenv.config({ path: envPath });

    if (env.error) {
      throw env.error;
    }

    return env.parsed;
  }
}
