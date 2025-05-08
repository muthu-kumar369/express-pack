module.exports = {
  testRouterContent: `
    const { Router } = require("express-pack");
    const TestController = require("../controller/index.js");
    
    Router.get("/status-check", TestController.status);
    Router.post("/post-status", TestController.postStatus);
    
    module.exports = Router;
    `,
  testControllerContent: `
    class TestController {
      status(req, res) {
        return res.json({ status: true, message: "App is running and working fine." });
      }
    
      postStatus(req, res) {
        return res.json({ status: true, message: "Post request received successfully." });
      }
    }
    
    module.exports = new TestController();
    `,
  routeConfigJsContent: `
    const StatusRoute = require('../src/test/router');
    
    module.exports = {
      routes: [
        {
          path: '/status',
          route: StatusRoute
        }
      ]
    };
    `,
  appConfigJsContent: `
    module.exports = {
      appConfig: {
        env: "development", // specify the environment
        cors: {},
        logger: {},
        bodyParser: {},
        security: {},
        compression: {},
      },
    };
    `,
  indexJsContent: `
    const { CreateApp, BindRoutes } = require("express-pack");
    
    // routes arrays
    const { routes } = require("./config/routeConfig");
    
    // app config for express-pack
    const { appConfig } = require("./config/appConfig");
    
    // create app from express pack
    const app = CreateApp(appConfig);
    
    // binding the routes with app
    BindRoutes(routes);
    
    app?.listen(3000, () => {
      console.log("✅ App is listening on port 3000");
    });
    `,
};
