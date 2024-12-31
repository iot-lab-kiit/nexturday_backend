"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../common/dtos");
const participant_1 = require("./participant");
const society_1 = require("./society");
class EventRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.eventController = new controllers_1.EventController();
        this.participantRoute = new participant_1.ParticipantRoute();
        this.societyRoute = new society_1.SocietyRoute();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use('/participants', new middlewares_1.RoleMiddleware('PARTICIPANT').verify, this.participantRoute.router);
        this.router.use('/society', new middlewares_1.RoleMiddleware('SOCIETY').verify, this.societyRoute.router),
            this.router.get('/', new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.eventController.getAllEvents);
        this.router.get('/:id', this.eventController.getEventById);
    }
}
exports.EventRoute = EventRoute;
