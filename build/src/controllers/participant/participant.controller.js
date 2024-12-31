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
exports.ParticipantController = void 0;
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const class_transformer_1 = require("class-transformer");
const dtos_1 = require("../../common/dtos");
class ParticipantController {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.participantService = new services_1.ParticipantService();
    }
    createParticipant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const rollNo = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.replace('@kiit.ac.in', '');
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.CreateParticipantDto, Object.assign(Object.assign(Object.assign({}, req.body), req.user), { rollNo }));
                const result = yield this.participantService.createParticipant(dto);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.participantService.getProfile(req.user.uid);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = (0, class_transformer_1.plainToInstance)(dtos_1.UpdateParticipantDto, req.body);
                const result = yield this.participantService.updateProfile(req.user.uid, dto);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ParticipantController = ParticipantController;
