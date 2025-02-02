const express = require("express");
const { SetupBodyParser } = require("./lib/body-parser");
const { SetupCors } = require("./lib/cors");
const { LoadEnv } = require("./lib/dotenv");
const { CreateLogger } = require("./lib/logger");
const { SetupSecurity } = require("./lib/security");
const { SetupCompression } = require("./lib/compression");

/**
 * Class that have method which is provided from Express pack
 */
class ExpressPack {
  app;

  constructor(express) {
    this.express = express;
    this.app = express();
  }

  /**
   * Used to create the app
   * @returns express app
   */
  createApp(appConfig = {}) {
    // custom middlware
    this.app.use((req, res, next) => {
      next();
    });

    // apply middleware based on given config
    if (Object.keys(appConfig)?.length) {
      Object.entries(appConfig).map(([key, value]) => {
        this.applyMiddleware(key, value);
      });
    }

    return this.app;
  }
  /**
   * Used to attach middleware with app
   * @param {*} key the setup key the need to apply
   * @param {*} value configuration of the setup
   */
  applyMiddleware(key, value) {
    switch (key) {
      case "bodyParser":
        SetupBodyParser(this.app, value);
        break;

      case "cors":
        SetupCors(this.app, value);
        break;

      case "env":
        LoadEnv(value);
        break;

      case "logger":
        CreateLogger(this.app, value);
        break;

      case "security":
        SetupSecurity(this.app, value);
        break;

      case "compression":
        SetupCompression(this.app, value);
        break;
    }
  }
  /**
   * Create the express routes
   * @returns express router
   */
  getRoute() {
    return this.express.Router();
  }

  /**
   * Used to bind the routes with app
   * @param {Array} routes Collection of routes
   */
  bindRoutes(routes) {
    if (!this.app) {
      throw new Error(
        "app not initialized, Initialize app by using CreateApp()"
      );
    }
    if (routes?.length) {
      routes?.map((option) => {
        this.app.use(option?.path, option?.route);
      });
    }
  }
}

// create the instance
const instance = new ExpressPack(express);

// Export the methods
module.exports = {
  CreateApp: instance.createApp.bind(instance),
  Router: instance.getRoute.bind(instance),
  BindRoutes: instance.bindRoutes.bind(instance),
};
