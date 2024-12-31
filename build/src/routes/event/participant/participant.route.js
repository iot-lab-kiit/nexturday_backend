"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantRoute = void 0;
const express_1 = require("express");
const participant_1 = require("../../../controllers/event/participant");
const utils_1 = require("../../../utils");
const middlewares_1 = require("../../../middlewares");
const dtos_1 = require("../../../common/dtos");
const favorite_route_1 = require("./favorite.route");
class ParticipantRoute {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.router = (0, express_1.Router)();
        this.participantController = new participant_1.ParticipantController();
        this.favoriteRoute = new favorite_route_1.FavoriteRoute();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(this.favoriteRoute.router);
        this.router.post('/:id', this.participantController.joinEvent);
        this.router.get('/', new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.participantController.getAllJoinedEvents);
    }
}
exports.ParticipantRoute = ParticipantRoute;
