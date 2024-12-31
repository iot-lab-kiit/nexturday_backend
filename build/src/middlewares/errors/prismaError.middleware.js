"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaErrorMiddleware = void 0;
const library_1 = require("@prisma/client/runtime/library");
class PrismaErrorMiddleware {
    static handle(err, req, res, next) {
        if (err instanceof library_1.PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2002':
                    console.log(err);
                    return res.status(409).json({
                        success: false,
                        message: 'unique constraint violation',
                    });
                case 'P2025':
                case 'P2016':
                    console.log(err);
                    return res.status(404).json({
                        success: false,
                        message: 'prisma known error',
                    });
                default:
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: 'prisma know error',
                    });
            }
        }
        next(err);
    }
}
exports.PrismaErrorMiddleware = PrismaErrorMiddleware;
