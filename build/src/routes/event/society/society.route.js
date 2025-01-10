"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocietyRoute = void 0;
const express_1 = require("express");
const utils_1 = require("../../../utils");
const middlewares_1 = require("../../../middlewares");
const dtos_1 = require("../../../common/dtos");
const society_1 = require("../../../controllers/event/society");
const society_2 = require("../../../middlewares/auth/event/society");
class SocietyRoute {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.router = (0, express_1.Router)();
        this.societyController = new society_1.SocietyController();
        this.eventAuthMiddleware = new society_2.EventAuthMiddleware();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.societyController.myEvents);
        this.router.get('/:id/participants', this.eventAuthMiddleware.verify, new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.societyController.getAllParticipants);
    }
}
exports.SocietyRoute = SocietyRoute;
