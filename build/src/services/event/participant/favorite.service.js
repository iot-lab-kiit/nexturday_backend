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
exports.FavoriteService = void 0;
const client_1 = require("@prisma/client");
const constants_1 = require("../../../common/constants");
class FavoriteService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    favoriteEvent(uid, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.favoriteEvent.create({
                data: {
                    eventId,
                    participantId: uid,
                },
            });
            return {
                success: true,
                message: 'event favorite successfully',
            };
        });
    }
    unfavoriteEvent(uid, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.favoriteEvent.delete({
                where: {
                    participantId_eventId: {
                        eventId,
                        participantId: uid,
                    },
                },
            });
            return {
                success: true,
                message: 'event unfavorite successfully',
            };
        });
    }
    getAllFavoriteEvents(uid, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalFavoriteEvents = yield this.prisma.eventParticipant.count({
                where: {
                    participantId: uid,
                },
            });
            const totalPages = Math.ceil(totalFavoriteEvents / constants_1.TAKE_PAGES);
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
                where: Object.assign({ favoriteBy: {
                        some: {
                            participantId: uid,
                        },
                    } }, (dto.q
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
                message: 'favorite events fetched successfully',
                data: {
                    currentPage: dto.page,
                    nextPage,
                    totalItems: totalFavoriteEvents,
                    totalPages,
                    data: events,
                },
            };
        });
    }
}
exports.FavoriteService = FavoriteService;
