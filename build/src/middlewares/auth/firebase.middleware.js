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
exports.FirebaseMiddleware = void 0;
const auth_1 = require("firebase-admin/auth");
const utils_1 = require("../../utils");
const firebase_1 = require("../../libs/firebase");
class FirebaseMiddleware {
    constructor() {
        utils_1.MethodBinder.bind(this);
        this.firebaseProvider = firebase_1.FirebaseProvider;
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new utils_1.CustomError('Authorization token is required', 401);
            }
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            try {
                const user = yield (0, auth_1.getAuth)(this.firebaseProvider.firebase).verifyIdToken(token);
                if (!((_b = user.email) === null || _b === void 0 ? void 0 : _b.endsWith('@kiit.ac.in'))) {
                    throw new utils_1.CustomError('kiit email allowed', 401);
                }
                req.user = {
                    email: user.email,
                    name: user.name,
                    uid: user.uid,
                    role: 'PARTICIPANT',
                    image: user === null || user === void 0 ? void 0 : user.picture,
                };
                next();
            }
            catch (error) {
                if (error instanceof auth_1.FirebaseAuthError) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token validation failed',
                    });
                }
                res.status(500).json({
                    success: false,
                    message: 'internal server error',
                });
            }
        });
    }
}
exports.FirebaseMiddleware = FirebaseMiddleware;
