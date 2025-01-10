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
exports.EventService = void 0;
const client_1 = require("@prisma/client");
const constants_1 = require("../../common/constants");
class EventService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getAllEvents(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalEvents = yield this.prisma.event.count();
            const totalPages = Math.ceil(totalEvents / constants_1.TAKE_PAGES);
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
                where: dto.q
                    ? {
                        OR: [
                            { name: { search: dto.q } },
                            { about: { search: dto.q } },
                            { society: { name: { search: dto.q } } },
                        ],
                    }
                    : undefined,
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
                    totalItems: totalEvents,
                    totalPages,
                    data: events,
                },
            };
        });
    }
    getEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.prisma.event.findUnique({
                where: {
                    id: eventId,
                },
                include: {
                    society: {
                        omit: {
                            password: true,
                        },
                    },
                    details: {
                        include: {
                            venue: true,
                        },
                    },
                    _count: {
                        select: {
                            participants: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'events fetched successfully',
                data: event,
            };
        });
    }
    createEvent(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emails, from, guidlines, name, paid, phoneNumbers, price, societyId, to, registrationUrl, websiteUrl, about, details, } = dto;
            yield this.prisma.event.create({
                data: {
                    about,
                    from,
                    name,
                    paid,
                    to,
                    emails,
                    guidlines,
                    websiteUrl,
                    societyId,
                    phoneNumbers,
                    price,
                    registrationUrl,
                    details: {
                        create: details.map((detail) => {
                            var _a, _b;
                            return ({
                                name: detail.name,
                                about: detail.about,
                                from: detail.from,
                                to: detail.to,
                                type: detail.type,
                                venue: {
                                    create: {
                                        mapUrl: (_a = detail.venue) === null || _a === void 0 ? void 0 : _a.mapUrl,
                                        name: (_b = detail.venue) === null || _b === void 0 ? void 0 : _b.name,
                                    },
                                },
                            });
                        }),
                    },
                },
            });
            return {
                success: true,
                message: 'event created successfully',
            };
        });
    }
    deleteEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.event.delete({
                where: {
                    id: eventId,
                },
            });
            return {
                success: true,
                message: 'event deleted successfully',
            };
        });
    }
}
exports.EventService = EventService;
