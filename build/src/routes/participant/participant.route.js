"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../common/dtos");
class ParticipantRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.participantController = new controllers_1.ParticipantController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', new middlewares_1.ValidationMiddleware([dtos_1.CreateParticipantDto, 'body']).validate, this.participantController.createParticipant);
        this.router.get('/', this.participantController.getProfile);
        this.router.patch('/', new middlewares_1.ValidationMiddleware([dtos_1.UpdateParticipantDto, 'body']).validate, this.participantController.updateProfile);
    }
}
exports.ParticipantRoute = ParticipantRoute;
