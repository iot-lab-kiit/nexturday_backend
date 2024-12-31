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
exports.SocietyController = void 0;
const society_1 = require("../../../services/event/society");
const utils_1 = require("../../../utils");
const class_transformer_1 = require("class-transformer");
const dtos_1 = require("../../../common/dtos");
class SocietyController {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.societyService = new society_1.SocietyService();
    }
    createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const societyId = req.user.sub;
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.CreateEventDto, Object.assign({ societyId }, req.body));
                const result = yield this.societyService.createEvent(dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    myEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const societyId = req.user.sub;
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.SearchDto, req.query);
                const result = yield this.societyService.myEvents(societyId, dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                const result = yield this.societyService.deleteEvent(eventId);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllParticipants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.SearchDto, req.query);
                const result = yield this.societyService.getAllParticipants(eventId, dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SocietyController = SocietyController;
