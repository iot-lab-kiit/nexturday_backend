"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRoute = void 0;
const express_1 = require("express");
const participant_1 = require("../../../controllers/event/participant");
const utils_1 = require("../../../utils");
const middlewares_1 = require("../../../middlewares");
const dtos_1 = require("../../../common/dtos");
class FavoriteRoute {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.router = (0, express_1.Router)();
        this.favoriteController = new participant_1.FavoriteController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/:id', this.favoriteController.favoriteEvent);
        this.router.delete('/:id', this.favoriteController.unfavoriteEvent);
        this.router.get('/', new middlewares_1.ValidationMiddleware([dtos_1.SearchDto, 'query']).validate, this.favoriteController.getAllFavoriteEvents);
    }
}
exports.FavoriteRoute = FavoriteRoute;
