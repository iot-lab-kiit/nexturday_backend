"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const utils_1 = require("../../../utils");
const participant_1 = require("../../../services/event/participant");
const class_transformer_1 = require("class-transformer");
const dtos_1 = require("../../../common/dtos");
class FavoriteController {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.favoriteService = new participant_1.FavoriteService();
    }
    favoriteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.user.uid;
                const eventId = req.params.id;
                const result = yield this.favoriteService.favoriteEvent(uid, eventId);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    unfavoriteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.user.uid;
                const eventId = req.params.id;
                const result = yield this.favoriteService.unfavoriteEvent(uid, eventId);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllFavoriteEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.user.uid;
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.SearchDto, req.query);
                const result = yield this.favoriteService.getAllFavoriteEvents(uid, dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FavoriteController = FavoriteController;