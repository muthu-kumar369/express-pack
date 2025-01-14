const express = require('express');

/**
 * Class that have method which is provided from Express pack
 */
class ExpressPack {
    app;

    constructor(express) {
        this.express = express;
        this.app = express()
    }

    /**
     * Used to create the app
     * @returns express app
     */
    createApp() {
        return this.app;
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
        if(!this.app){
            throw new Error('app not initialized, Initialize app by using CreateApp()')
        }
        if (routes?.length) {
            routes?.map((option) => {
                this.app.use(option?.path, option?.route);
            })
        }
    }
}

// create the instance 
const instance = new ExpressPack(express);

// Export the methods
module.exports = {
    CreateApp: instance.createApp.bind(instance),
    Router: instance.getRoute.bind(instance),
    BindRoutes: instance.bindRoutes.bind(instance)
};