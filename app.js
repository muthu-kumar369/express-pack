// const compression = require("compression");
// const { CreateApp, Router, BindRoutes } = require("./src/index.js");
// const { SetupBodyParser } = require("./src/common/body-parser");
// const { SetupCompression } = require("./src/common/compression");
// const { SetupCors } = require("./src/common/cors");
// const { LoadEnv } = require("./src/common/dotenv");
// const {
//   logger,
//   CreateLogger,
//   LogFormat,
//   LogTransport,
// } = require("./src/logger/winston");

// const { SetupSecurity } = require("./src/security/helmet");
// const { AsyncRouteWrapper } = require("./src/common/async-route-wrapper");
// const { NotFoundRouteHandler } = require("./src/error/error-handler");
// const { checkDotEnv } = require("./src/auth/middleware/jwt");
// const { AuthMiddleware } = require("./src/middleware/auth-middleware");
// const {
//   ValidateRequestMiddleware,
// } = require("./src/middleware/request-validator");
// const { ApplyRequestTracer } = require("./src/middleware/request-tracer");

// export * from "./src/util/index.js";
// export * from "./src/index.js";

// module.exports = {
//   CreateApp,
//   Router: Router(),
//   BindRoutes,
//   LoadEnv,
//   logger: logger(),
//   CreateLogger,
//   LogFormat,
//   LogTransport,
//   SetupBodyParser,
//   SetupCors,
//   SetupSecurity,
//   SetupCompression,
//   compression,
//   AsyncRouteWrapper,
//   NotFoundRouteHandler,
//   checkDotEnv,
//   AuthMiddleware,
//   ValidateRequestMiddleware,
//   ApplyRequestTracer,
//   DateUtil,
// };

export * from "./src/index.js";
