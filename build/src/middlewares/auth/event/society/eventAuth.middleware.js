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
exports.EventAuthMiddleware = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../../../../utils");
class EventAuthMiddleware {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.prisma = new client_1.PrismaClient();
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const societyId = req.user.sub;
                const eventId = req.params.id;
                const event = yield this.prisma.event.findUnique({
                    where: {
                        id: eventId,
                        societyId,
                    },
                });
                if (!event) {
                    throw new utils_1.CustomError('Unauthorized Exception', 401);
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EventAuthMiddleware = EventAuthMiddleware;
