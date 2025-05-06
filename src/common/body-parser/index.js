const bodyParser = require("body-parser");
const parserConfig = require("../../util/config/bodyParserConfig");

/**
 * BodyParser class used to setup body parser for app
 */
class BodyParser {
  /**
   * Used to setup body parser for app
   * @param {*} app Express app
   * @param {*} customConfig user config details for body parser
   */
  setupBodyParser(app, customConfig) {
    const config = parserConfig.getConfig(customConfig);

    // allow json input
    app.use(bodyParser.json(config?.json));

    // allow form input
    app.use(bodyParser.urlencoded(config?.urlencoded));

    // allow raw input
    app.use(bodyParser.raw(config?.raw));

    // allow text input
    app.use(bodyParser.text(config?.text));
  }
}

// create intannce
const instance = new BodyParser();

module.exports = {
  SetupBodyParser: instance.setupBodyParser,
};
