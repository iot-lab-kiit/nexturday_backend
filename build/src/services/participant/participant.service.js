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
exports.ParticipantService = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
class ParticipantService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createParticipant(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { branch, email, name, phoneNumber, rollNo, studyYear, uid, whatsappNumber, imageUrl, } = dto;
            const society = yield this.prisma.society.findUnique({
                where: {
                    uid,
                },
            });
            if (society) {
                throw new utils_1.CustomError('email already registered as society', 400);
            }
            const participant = yield this.prisma.participant.create({
                data: {
                    branch,
                    email,
                    name,
                    phoneNumber,
                    rollNo,
                    studyYear,
                    uid,
                    whatsappNumber,
                    imageUrl,
                },
            });
            return {
                success: true,
                message: 'participant created successfully',
                data: participant,
            };
        });
    }
    getProfile(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const participant = yield this.prisma.participant.findUnique({
                where: {
                    uid,
                },
            });
            return {
                success: true,
                message: 'profile fetched successfully',
                data: participant,
            };
        });
    }
    updateProfile(uid, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { branch, phoneNumber, studyYear, whatsappNumber } = dto;
            yield this.prisma.participant.update({
                where: {
                    uid,
                },
                data: {
                    branch,
                    phoneNumber,
                    whatsappNumber,
                    studyYear,
                },
            });
            return {
                success: true,
                message: 'participant updated successfully',
            };
        });
    }
}
exports.ParticipantService = ParticipantService;
