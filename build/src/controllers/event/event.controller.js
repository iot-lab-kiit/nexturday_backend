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
exports.EventController = void 0;
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const class_transformer_1 = require("class-transformer");
const dtos_1 = require("../../common/dtos");
class EventController {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.eventService = new services_1.EventService();
    }
    getAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.SearchDto, req.query);
                const result = yield this.eventService.getAllEvents(dto);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.eventService.getEventById(req.params.id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const societyId = req.user.sub;
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.CreateEventDto, Object.assign({ societyId }, req.body));
                const result = yield this.eventService.createEvent(dto);
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
                const result = yield this.eventService.deleteEvent(eventId);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EventController = EventController;
