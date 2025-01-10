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
exports.SocietyService = void 0;
const client_1 = require("@prisma/client");
const constants_1 = require("../../../common/constants");
class SocietyService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    myEvents(societyId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalMyEvents = yield this.prisma.event.count({
                where: {
                    societyId,
                },
            });
            const totalPages = Math.ceil(totalMyEvents / constants_1.TAKE_PAGES);
            const nextPage = totalPages > dto.page ? dto.page + 1 : null;
            const events = yield this.prisma.event.findMany({
                skip: (dto.page - 1) * constants_1.TAKE_PAGES,
                take: constants_1.TAKE_PAGES,
                orderBy: dto.q
                    ? [
                        {
                            _relevance: {
                                fields: ['name', 'about'],
                                search: dto.q,
                                sort: 'desc',
                            },
                        },
                        { [dto.field]: dto.direction },
                    ]
                    : [{ [dto.field]: dto.direction }],
                where: Object.assign({ societyId }, (dto.q
                    ? {
                        OR: [
                            { name: { search: dto.q } },
                            { about: { search: dto.q } },
                            { society: { name: { search: dto.q } } },
                        ],
                    }
                    : undefined)),
                include: {
                    society: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'events fetched successfully',
                data: {
                    currentPage: dto.page,
                    nextPage,
                    totalItems: totalMyEvents,
                    totalPages,
                    data: events,
                },
            };
        });
    }
    getAllParticipants(eventId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalParticipants = yield this.prisma.eventParticipant.count({
                where: {
                    eventId,
                },
            });
            const totalPages = Math.ceil(totalParticipants / constants_1.TAKE_PAGES);
            const nextPage = totalPages > dto.page ? dto.page + 1 : null;
            const participants = yield this.prisma.eventParticipant.findMany({
                skip: (dto.page - 1) * constants_1.TAKE_PAGES,
                take: constants_1.TAKE_PAGES,
                orderBy: dto.q
                    ? [
                        {
                            participant: {
                                _relevance: {
                                    fields: ['name', 'email', 'rollNo'],
                                    search: dto.q,
                                    sort: 'desc',
                                },
                            },
                        },
                        { [dto.field]: dto.direction },
                    ]
                    : [{ [dto.field]: dto.direction }],
                where: {
                    eventId,
                    participant: dto.q
                        ? {
                            OR: [
                                { name: { search: dto.q } },
                                { email: { search: dto.q } },
                                { rollNo: { search: dto.q } },
                            ],
                        }
                        : undefined,
                },
                include: {
                    participant: true,
                },
            });
            return {
                success: true,
                message: 'participants fetched successfully',
                data: {
                    currentPage: dto.page,
                    nextPage,
                    totalItems: totalParticipants,
                    totalPages,
                    data: participants,
                },
            };
        });
    }
}
exports.SocietyService = SocietyService;
