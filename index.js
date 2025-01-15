const { CreateApp, Router, BindRoutes } = require("./src/index");
const { SetupBodyParser } = require("./src/lib/body-parser");
const { SetupCors } = require("./src/lib/cors");
const { LoadEnv } = require("./src/lib/dotenv");
const {
  logger,
  CreateLogger,
  LogFormat,
  LogTransport,
} = require("./src/lib/logger");
const { SetupSecurity } = require("./src/lib/security");

module.exports = {
  CreateApp,
  Router: Router(),
  BindRoutes,
  LoadEnv,
  logger: logger(),
  CreateLogger,
  LogFormat,
  LogTransport,
  SetupBodyParser,
  SetupCors,
  SetupSecurity,
};
