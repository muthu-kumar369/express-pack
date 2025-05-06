const compression = require("compression");
const { CreateApp, Router, BindRoutes } = require("./src/index");
const { SetupBodyParser } = require("./src/common/body-parser");
const { SetupCompression } = require("./src/common/compression");
const { SetupCors } = require("./src/common/cors");
const { LoadEnv } = require("./src/common/dotenv");
const {
  logger,
  CreateLogger,
  LogFormat,
  LogTransport,
} = require("./src/logger/winston");
const { SetupSecurity } = require("./src/security/helmet");

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
  SetupCompression,
  compression,
};
