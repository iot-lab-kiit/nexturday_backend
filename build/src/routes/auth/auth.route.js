"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils");
const middlewares_1 = require("../../middlewares");
const login_1 = require("../../common/dtos/login");
const login_2 = require("../../controllers/login");
class AuthRoute {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.router = (0, express_1.Router)();
        this.loginController = new login_2.LoginController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', new middlewares_1.ValidationMiddleware([login_1.loginDto, 'body']).validate, this.loginController.login);
        this.router.post('/signup', new middlewares_1.ValidationMiddleware([login_1.signupDto, 'body']).validate, this.loginController.signup);
    }
}
exports.AuthRoute = AuthRoute;
