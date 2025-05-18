import bodyParser from "body-parser";
import parserConfig from "../../config/common/bodyParserConfig";
import { BodyParserInitParams } from "./types";

/**
 * BodyParser class used to setup body parser for app
 */
export class BodyParser {
  /**
   * Used to setup body parser for app
   * @param app Express app and config
   */
  static init({ app, customConfig = {} }: BodyParserInitParams): void {
    const config = parserConfig.getConfig(customConfig);

    // allow json input
    if (config?.json) app.use(bodyParser.json(config.json));

    // allow form input
    if (config?.urlencoded) app.use(bodyParser.urlencoded(config.urlencoded));

    // allow raw input
    if (config?.raw) app.use(bodyParser.raw(config.raw));

    // allow text input
    if (config?.text) app.use(bodyParser.text(config.text));
  }
}
