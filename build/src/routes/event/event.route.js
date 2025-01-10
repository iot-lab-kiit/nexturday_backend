"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../common/dtos");
const participant_1 = require("./participant");
const society_1 = require("./society");
const society_2 = require("../../middlewares/auth/event/society");
class EventRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.eventController = new controllers_1.EventController();
        this.participantRoute = new participant_1.ParticipantRoute();
        this.societyRoute = new society_1.SocietyRoute();
        this.eventAuthMiddleware = new society_2.EventAuthMiddleware();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.eventController.getAllEvents);
        this.router.get('/:id', this.eventController.getEventById);
        this.router.use('/participants', new middlewares_1.RoleMiddleware('PARTICIPANT').verify, this.participantRoute.router);
        this.router.use(new middlewares_1.RoleMiddleware('SOCIETY').verify);
        this.router.use('/society', this.societyRoute.router);
        this.router.post('/', new middlewares_1.ValidationMiddleware([dtos_1.CreateEventDto, 'body']).validate, this.eventController.createEvent);
        this.router.delete('/:id', this.eventAuthMiddleware.verify, this.eventController.deleteEvents);
    }
}
exports.EventRoute = EventRoute;
