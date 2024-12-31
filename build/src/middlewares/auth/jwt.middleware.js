"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../../utils");
require("dotenv/config");
class JWTMiddleware {
    constructor() {
        utils_1.MethodBinder.bind(this);
    }
    verify(req, res, next) {
        var _a;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new utils_1.CustomError('Authorization token is required', 401);
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        try {
            const user = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            req.user = {
                email: user.email,
                name: user.name,
                sub: user.sub,
                role: 'SOCIETY',
                image: user === null || user === void 0 ? void 0 : user.image,
            };
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid token',
                });
            }
            res.status(500).json({
                success: false,
                message: 'internal server error',
            });
        }
    }
}
exports.JWTMiddleware = JWTMiddleware;
