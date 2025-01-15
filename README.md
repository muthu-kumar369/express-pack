# express-pack

![Express-Pack Logo](https://i.ibb.co/T4TpXH1/logo.png) <!-- Replace with actual logo if available -->

[![npm version](https://img.shields.io/npm/v/express-pack.svg)](https://www.npmjs.com/package/express-pack)
[![License](https://img.shields.io/npm/l/express-pack.svg)](https://github.com/your-repo/express-pack/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/express-pack)](https://www.npmjs.com/package/express-pack)

`express-pack` simplifies Express.js app creation by bundling common middleware and providing a straightforward configuration system. Perfect for new projects or rapid prototyping!

---

## 🚀 Features

- Pre-configured middleware:
  - Environment management using `dotenv`
  - Request logging with `winston`
  - Security enhancements with `helmet`
  - Body parsing with `body-parser`
- Simplified route management.
- Fully customizable via configuration files.

---

## 📦 Installation

Install the package using npm or yarn:

npm install express-pack

# or

yarn add express-pack

# 🛠️ Usage

Here’s how you can set up and start using `express-pack`:

## **index.js / server.js**

```javascript
const { CreateApp, BindRoutes } = require("express-pack");

// routes arrays
const { routes } = require("./config/routeConfig");

// app config for express-pack
const { appConfig } = require("./config/appConfig");

// create app from express-pack
const app = CreateApp(appConfig);

// binding the routes with app
BindRoutes(routes);

app?.listen(3000, () => {
  console.log("I am listening to 3000 port");
});
```

## **appConfig.js**

### Customize your application behavior with the `appConfig` object.

```javascript
module.exports = {
  appConfig: {
    env: "", // Environment variable (dotenv)
    cors: {}, // CORS settings for cross-origin requests
    logger: {}, // Logger configuration ( Winston configuration)
    bodyParser: {}, // Body parser settings for handling request bodies
    security: {}, // Security-related configurations (Helmet)
  },
};
```

## **routeConfig.js**

### Organize your routes easily with the `routes` array.

```javascript
const TestRoute = require("../src/test/route");

module.exports = {
  routes: [
    {
      path: "/route", // Define the URL path for this route
      route: TestRoute, // Link to the corresponding route file
    },
  ],
};
```

## **Example Route (TestRoute)**

### Define and manage your endpoints with ease using `Router`.

```javascript
const { Router } = require("express-pack");
const TestController = require("../controller/index");

// Define a GET endpoint for health checks or basic operations
Router.get("/health-check", TestController.testMethod);

// Define a POST endpoint for creating or processing data
Router.post("/submit-data", TestController.testPostMethod);

module.exports = Router;
```

## 📖 Documentation

### 1. `CreateApp(config)`

Creates an Express application pre-configured with essential middleware.

- **Parameters**:  
  `config` (Object) – Your application configuration.
- **Returns**:  
  An instance of an Express app.

---

### 2. `BindRoutes(routes)`

Binds an array of routes to the application.

- **Parameters**:  
  `routes` (Array) – A list of route configurations.

- **Example**:

```javascript
const routes = [{ path: "/api", route: ApiRoute }];
BindRoutes(routes);
```

## 📂 Project Structure

```bash
my-project/
├── config/
│   ├── appConfig.js        # Application configuration
│   └── routeConfig.js      # Routes configuration
├── src/
│   └── test/               # Your route handlers
│       └── route.js        # Example route handler
├── index.js                # Main entry point of the application


```

## 🤝 Acknowledgments

Special thanks to the developers and contributors who make Express.js development easier every day!
