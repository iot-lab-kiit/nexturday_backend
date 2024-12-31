"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
class HomeRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.homeController = new controllers_1.HomeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', this.homeController.welcome);
    }
}
exports.HomeRoute = HomeRoute;
